# Todo-Lite 构件设计

## 1 构件图

![component](.\img\component.png)

## 2 构件设计说明

### 1. **用户界面层 (UI Layer)**

- **包含**：所有 Vue 组件 (`AuthView`, `TaskListView` 等)。
- **职责**：负责用户交互和界面渲染。**不包含任何业务逻辑**。
- **依赖**：只调用 `业务逻辑层` 的服务 (`AuthService`, `TaskService`, `UIStateService`) 来响应用户操作。
- **示例**：当用户点击“登录”，`AuthView` 调用 `AuthService.loginUser()`。

### 2. **业务逻辑层 (BLL Layer)**

- **包含**：`AuthService`, `TaskService`, `UIStateService`。

- **职责**：实现核心业务规则。协调数据流，处理复杂逻辑（如验证、状态变更）。

- 依赖：

- 依赖 `工具与公共服务层` 进行验证和通知。
- 通过 Pinia Store 与 `数据访问层` 交互，实现状态管理和持久化。

### 3. **数据访问与状态层 (DAL Layer)**

- 包含：

- **Pinia Stores**：`authStore`, `taskStore`, `uiStore` —— 管理应用状态。
- **适配器**：`HTTPClient` (封装 API 调用), `StorageAdapter` (封装 `localStorage` 操作)。

- 职责：

- `Pinia Store`：作为状态容器，暴露 `getter` 和 `action` 供上层调用。
- `HTTPClient` / `StorageAdapter`：提供统一的数据访问接口，屏蔽底层细节。

- **依赖**：直接与外部 API 或浏览器存储通信。

### 4. **工具与公共服务层 (Utils Layer)**

- **包含**：`ValidationService`, `NotificationService`。
- **职责**：提供跨领域、可复用的通用功能。
- **特点**：无状态、高内聚、低耦合，被多个上层模块依赖。

### 5. **外部依赖**

- `[认证API]` 和 `[任务日历API]`：代表后端服务，由 `HTTPClient` 调用。
