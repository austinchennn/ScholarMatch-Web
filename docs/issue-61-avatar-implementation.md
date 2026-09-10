# Issue #61：需求、修改位置与验证

对应 issue：https://github.com/austinchennn/ScholarMatch-Web/issues/61

## 1. 这个任务在做什么

Scholar 是网站中的学者/用户。Avatar 是头像。这个任务让用户在查看申请、聊天和通知时，能通过照片辨认对方；照片不可用时仍保留姓名首字母。

例如：B 申请 A 发布的研究项目，A 在 My Postings 审核时应该看见 B 的头像；B 在 My Applications 查看申请时应该看见 A 的头像；两人聊天时，对方发来的消息旁应该有对方的头像。

Issue 明确要求：

1. My Postings：申请人姓名旁显示申请人头像。
2. My Applications：显示发布者头像。
3. 聊天：在对方的消息气泡旁显示发送者头像。
4. 通知：每条通知显示触发通知的人的头像。
5. 未上传头像、接口未提供图片、图片加载失败时，使用姓名首字母占位。
6. 上传图片在浏览器中等比例缩小到约 512px 并压缩，检查大小后再转 base64。
7. 非图片、超限文件或不可解码的图片显示错误；正常的 8 MB 照片可以压缩后使用。
8. 补充测试，运行 `npm test`、`npm run lint` 和 `npm run build`。

检查代码时还发现机会列表中的 `PostingCard` 显示发布者姓名，因此也为它补充了头像。

## 2. 逐文件修改位置和原因

下面的路径均相对于仓库根目录。

| 文件 | 修改位置和内容 | 原因 |
|---|---|---|
| `src/lib/api/postings.ts` | `PostingApplication` 新增可选的 `applicantAvatarUrl`、`posterAvatarUrl`；`Posting` 新增可选的 `posterAvatarUrl` | 让 TypeScript 数据类型描述后端的新字段，旧接口缺少字段时仍兼容 |
| `src/lib/api/messages.ts` | `Message` 新增可选的 `senderAvatarUrl` | 接收每条消息的发送者头像 |
| `src/lib/api/notifications.ts` | `Notification` 新增可选的 `actorAvatarUrl` 和 `actorName` | 显示触发通知的人的头像；后端提供姓名时用它生成首字母 |
| `src/app/(app)/postings/mine/MyPostings.tsx` | `posting.applications.map(...)` 内，将申请人信息改为头像与姓名/留言并排 | 审核列表能辨认申请人；保留接受、拒绝和打开聊天操作 |
| `src/app/(app)/applications/MyApplications.tsx` | 发布者信息的 `CardDescription` 中加入 `ScholarAvatar` | 显示发布者照片；项目被删除时仍显示 Unknown poster 占位 |
| `src/app/(app)/matches/[scholarId]/MessageBubble.tsx` | 组件参数增加 `senderName`、`senderAvatarUrl`；在 `!isMine` 时渲染头像 | 对方消息旁显示头像；自己的消息保持右侧排布 |
| `src/app/(app)/matches/[scholarId]/ChatView.tsx` | `messages.map(...)` 渲染气泡时传入对方姓名与发送者头像 | 把接口数据交给气泡；字段缺失时兼容已有的对方资料头像 |
| `src/app/(app)/notifications/NotificationsList.tsx` | 通知行的 `CardContent` 增加 `ScholarAvatar` | 展示 actor 图片，并保留原有跳转、New 标记和已读操作 |
| `src/components/posting-card.tsx` | 发布者 `CardDescription` 增加小头像 | 同时覆盖机会列表和我的发布中的发布者信息 |
| `src/components/scholar-avatar.tsx` | `initials(...)` 支持任意空白分隔；空姓名使用 `?` | 所有入口复用现有图片失败回退；避免空白姓名产生空圆圈 |
| `src/lib/avatar-upload.ts`（新增） | `prepareAvatar(...)` 及解码、压缩、读取辅助函数 | 将图片处理与界面分开，方便测试；原图不会直接被转成 base64 |
| `src/app/(app)/profile/edit/AvatarUploadField.tsx` | 异步 `handleChange(...)`；新增处理状态、错误提示、重试支持；预览复用 `ScholarAvatar` | 显示压缩进度和可读错误；失败时保留之前的头像 |
| `src/app/(app)/profile/edit/ProfileEditForm.tsx` | 新增 `isAvatarProcessing`；连接上传状态；更新 `handleSave(...)` 和保存按钮 | 避免压缩未完成时保存旧头像；保存期间禁用上传 |
| `src/components/scholar-avatars.test.tsx`（新增） | 17 个真实组件渲染/交互测试 | 覆盖统一头像、申请列表、发布卡片、聊天和通知；模拟浏览器图片加载结果 |
| `src/lib/avatar-upload.test.ts`（新增） | 16 个图片处理单元测试 | 覆盖 8 MB 输入、缩放比例、尺寸/质量限制、损坏图片及读取失败等 |
| `src/app/(app)/profile/edit/AvatarUploadField.test.tsx`（新增） | 8 个上传和完整资料表单测试 | 验证可见错误、重试、保留旧头像、压缩期间禁用保存及最终提交内容 |
| `package.json`、`package-lock.json` | 新增开发依赖 `@testing-library/react` 和 `jsdom` | 在测试中渲染真实组件、操作文件输入和保存按钮；不增加产品运行时依赖 |
| `vitest.config.mts` | 将测试匹配范围扩展到 `.test.ts` 和 `.test.tsx` | 让 `npm test` 同时运行已有 API 测试和新的组件测试 |
| `docs/issue-61-avatar-implementation.md`（本文件） | 记录需求、实现和验证边界 | 便于逐项核对 issue 和审阅代码 |

## 3. 上传处理流程

`选择文件 → 验证类型/原始大小 → 解码图片 → 等比例缩小 → JPEG 压缩 → 检查结果大小 → 转 base64 → 更新预览 → 保存资料`

- 原文件上限：10 MiB（界面沿用常见的 MB 表述），支持 issue 指定的 8 MB 照片。
- 图片最长边：最多 512px；保持宽高比，小图不放大。
- JPEG 质量从 0.85 开始，必要时依次降低到 0.7、0.55、0.4。
- 压缩结果上限：256 KiB。转 base64 后约 342 KiB，为 Next.js 默认 1 MB Server Action 请求限制留出余量。这里只限制头像，其他资料字段仍占用请求空间。
- 透明背景转为白底，避免转换成 JPEG 后变成黑色。
- 非图片、空文件、超过 10 MiB、无法解码、压缩后仍超限、编码或读取失败，均会显示错误。
- 错误不会覆盖之前的有效头像，同一个文件可以重新选择。
- 图片处理期间禁用文件选择和保存；保存资料期间也禁用文件选择。
- 解码使用临时 object URL，处理结束或失败都会释放。

## 4. 兼容策略和后端依赖

Issue 指明依赖 `austinchennn/scholarmatch-server#15`。检查时该 issue 返回 404，因此无法确认它的实现或部署状态；本次只修改 Web 仓库。

- 新字段均为可选、允许 `null`，旧接口响应不会导致页面报错。
- 聊天的 `senderAvatarUrl` 为 `undefined`（字段缺失）时，使用已经取得的 `otherAvatarUrl`；为 `null`（明确没有头像）时，使用姓名首字母。
- 通知接口原类型没有单独的人名字段。本次兼容可选的 `actorName`；没有姓名时使用通用 Scholar 占位（S），不会从通知文本猜测某个人的姓名。
- `Posting.posterAvatarUrl` 用于补全机会卡片。如果后端尚未提供该字段，卡片使用发布者姓名首字母。
- 真正显示申请人、发布者及通知触发者的照片，仍需要后端在对应响应中返回有效 URL。

## 5. 验证结果

2026-09-10，本次修改基于 `main` 的 `d99c4c6ef6e718834c7aeef3003cf588fb0d30b9`。

| 检查 | 结果 |
|---|---|
| 修改前 `npm test` | 15 个文件、47 个测试通过 |
| 修改后 `npm test` | 18 个文件、88 个测试通过，新增 41 个 |
| `npm run lint` | 通过 |
| `npm run build` | 通过，包括 TypeScript 检查及页面生成 |
| `git diff --check` | 通过 |

测试使用真实 React/Base UI 组件和模拟的接口响应。JSDOM 不执行真实图片解码和 canvas 编码，图片处理测试用模拟对象验证输入、尺寸、编码顺序、大小限制和错误分支。

真实浏览器的大图检查尝试被当前云浏览器的本地地址访问策略拦截，未计为通过。未使用真实 A/B 账号完成后端联调，也未将本次修改部署到生产。

后端就绪后的人工验收：

1. 账号 B 设置头像后，申请账号 A 的项目；A 在 My Postings 看见 B 的照片。
2. B 在 My Applications 看见 A 的照片。
3. 打开聊天，对方消息旁显示正确照片；自己的消息不显示对方照片。
4. 收到通知后检查对应人的照片和通知原有跳转/已读行为。
5. 上传真实约 8 MB 照片，等待预览更新后保存并刷新，确认头像保存成功。
6. 选择非图片、损坏图片和超过 10 MiB 的文件，确认错误提示与旧头像保留。
7. 检查没有头像或图片链接失效时的首字母占位。
