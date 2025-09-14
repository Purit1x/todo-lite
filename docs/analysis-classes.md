# Todo-Lite 分析类

## 1 类图

![analysis-classes](.\img\analysis-classes.png)

## 2 各类简述

### 1. `User` (用户)

- **职责**：代表系统中的用户实体，管理用户身份信息。

- 属性 (Properties):

- `id: string`
- `email: string`
- `username: string`
- `password: string` (注意：生产环境应加密存储)

- 方法 (Methods):

- `register(email: string, username: string, password: string): Promise<void>` (uc001)
- `login(credentials: string, password: string): Promise<void>` (uc002)
- `logout(): void` (uc003)

### 2. `Task` (任务)

- **职责**：代表一个待办事项，包含所有任务相关的数据。

- 属性 (Properties):

- `id: string`
- `title: string` (必填, uc004)
- `description: string`
- `dueDate: Date`
- `priority: 'high' | 'medium' | 'low'` (uc004, uc009)
- `tags: Tag[]` (关联到 `Tag` 类)
- `completed: boolean` (uc007)
- `createdAt: Date`
- `updatedAt: Date`

- 方法 (Methods):

- `validate(): boolean` (验证标题非空等, uc004, uc005)
- `markAsCompleted(): void` (uc007)

### 3. `Tag` (标签)

- **职责**：用于对任务进行分类和组织。

- 属性 (Properties):

- `id: string`
- `name: string`
- `color: string` (用于日历视图渲染, uc008)

- 方法 (Methods):

- `create(name: string, color?: string): Tag` (uc004)
- `rename(newName: string): void`

### 4. `AuthService` (认证服务)

- **职责**：处理所有与用户认证相关的业务逻辑，是 `User` 类与后端API之间的协调者。

- 方法 (Methods):

- `registerUser(user: User): Promise<AuthResponse>` (调用API, uc001)
- `loginUser(credentials: LoginCredentials): Promise<AuthResponse>` (调用API, uc002)
- `logoutUser(): void` (清除会话, uc003)
- `isAuthenticated(): boolean` (检查Token有效性)
- `getCurrentUser(): User | null`

#### 5. `TaskService` (任务服务)

- **职责**：处理所有与任务管理相关的业务逻辑，是 `Task` 类与数据源（API或本地存储）之间的协调者。

- 方法 (Methods):

- `createTask(task: Task): Promise<Task>` (uc004)
- `updateTask(task: Task): Promise<Task>` (uc005)
- `deleteTask(taskId: string): Promise<void>` (uc006)
- `getTasks(filter?: FilterCriteria): Promise<Task[]>` (uc008, uc009)
- `getTasksByDateRange(startDate: Date, endDate: Date): Promise<Task[]>` (uc008)
- `markTaskCompleted(taskId: string): Promise<Task>` (uc007)

### 6. `UIStateService` (UI状态服务)

- **职责**：管理与用户界面相关的非业务状态。

- 属性 (Properties):

- `currentView: 'day' | 'week' | 'month'` (uc008)
- `searchQuery: string` (uc009)
- `filterCriteria: FilterCriteria` (uc009)
- `theme: 'light' | 'dark'` (uc010)

- 方法 (Methods):

- `setCurrentView(view: 'day' | 'week' | 'month'): void` (uc008)
- `setSearchQuery(query: string): void` (uc009)
- `setFilter(criteria: FilterCriteria): void` (uc009)
- `toggleTheme(): void` (uc010)
- `saveThemePreference(theme: 'light' | 'dark'): void` (保存到 `LocalStorage`)
- `loadThemePreference(): 'light' | 'dark'` (从 `LocalStorage` 加载)

### 7. `ValidationService` (验证服务)

- **职责**：提供通用的数据验证功能。

- 方法 (Methods):

- `validateEmail(email: string): boolean` (uc001)
- `validatePassword(password: string): { isValid: boolean; message: string }` (uc001)
- `isPasswordMatch(password: string, confirmPassword: string): boolean` (uc001)
- `validateTask(task: Task): ValidationResult` (uc004, uc005)

#### 8. `NotificationService` (通知服务)

- **职责**：统一管理用户提示和消息显示。

- 方法 (Methods):

- `showSuccess(message: string): void` (uc001)
- `showError(message: string): void` (uc001, uc002, uc006, uc007, uc008, uc009)
- `showWarning(message: string): void` (uc003)

## 3 类间关系

- **`User`** 和 **`AuthService`**：`AuthService` 依赖 `User` 来执行认证操作（依赖关系）。
- **`Task`** 和 **`Tag`**：一个 `Task` 可以有多个 `Tag`，一个 `Tag` 可以属于多个 `Task`（多对多关联）。
- **`TaskService`** 和 **`Task`**：`TaskService` 管理 `Task` 对象的生命周期（聚合关系）。
- **`TaskService`** 和 **`ValidationService`**：`TaskService` 在创建/更新任务前会调用 `ValidationService` 进行校验（依赖关系）。
- **`AuthService`** 和 **`NotificationService`**：认证操作成功或失败时，会调用 `NotificationService` 显示消息（依赖关系）。
- **`UIStateService`** 和 **`NotificationService`**：UI状态变更（如保存失败）可能需要通知用户（依赖关系）。
