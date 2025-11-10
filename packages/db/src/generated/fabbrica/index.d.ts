import type { Tasks } from "../prisma/client.js";
import type { Organization } from "../prisma/client.js";
import type { Client } from "../prisma/client.js";
import type { User } from "../prisma/client.js";
import type { Application } from "../prisma/client.js";
import type { ApplicationHistory } from "../prisma/client.js";
import type { Role } from "../prisma/client.js";
import type { Permission } from "../prisma/client.js";
import type { UserClientRole } from "../prisma/client.js";
import type { TaskStatus } from "../prisma/client.js";
import type { ApplicationType } from "../prisma/client.js";
import type { ApplicationStatus } from "../prisma/client.js";
import type { Prisma } from "../prisma/client.js";
import type { Resolver } from "@quramy/prisma-fabbrica/lib/internal";
export { resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";
type BuildDataOptions<TTransients extends Record<string, unknown>> = {
    readonly seq: number;
} & TTransients;
type TraitName = string | symbol;
type CallbackDefineOptions<TCreated, TCreateInput, TTransients extends Record<string, unknown>> = {
    onAfterBuild?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onBeforeCreate?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onAfterCreate?: (created: TCreated, transientFields: TTransients) => void | PromiseLike<void>;
};
export declare const initialize: (options: import("@quramy/prisma-fabbrica/lib/initialize.js").InitializeOptions) => void;
type TasksFactoryDefineInput = {
    id?: string;
    content?: string;
    status?: TaskStatus;
    completedAt?: Date | null;
    version?: number;
    createdAt?: Date;
    updatedAt?: Date;
    users?: Prisma.UserCreateNestedManyWithoutTasksInput;
};
type TasksTransientFields = Record<string, unknown> & Partial<Record<keyof TasksFactoryDefineInput, never>>;
type TasksFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<TasksFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Tasks, Prisma.TasksCreateInput, TTransients>;
type TasksFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<TasksFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: TraitName]: TasksFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Tasks, Prisma.TasksCreateInput, TTransients>;
type TasksTraitKeys<TOptions extends TasksFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;
export interface TasksFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Tasks";
    build(inputData?: Partial<Prisma.TasksCreateInput & TTransients>): PromiseLike<Prisma.TasksCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.TasksCreateInput & TTransients>): PromiseLike<Prisma.TasksCreateInput>;
    buildList(list: readonly Partial<Prisma.TasksCreateInput & TTransients>[]): PromiseLike<Prisma.TasksCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.TasksCreateInput & TTransients>): PromiseLike<Prisma.TasksCreateInput[]>;
    pickForConnect(inputData: Tasks): Pick<Tasks, "id">;
    create(inputData?: Partial<Prisma.TasksCreateInput & TTransients>): PromiseLike<Tasks>;
    createList(list: readonly Partial<Prisma.TasksCreateInput & TTransients>[]): PromiseLike<Tasks[]>;
    createList(count: number, item?: Partial<Prisma.TasksCreateInput & TTransients>): PromiseLike<Tasks[]>;
    createForConnect(inputData?: Partial<Prisma.TasksCreateInput & TTransients>): PromiseLike<Pick<Tasks, "id">>;
}
export interface TasksFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends TasksFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): TasksFactoryInterfaceWithoutTraits<TTransients>;
}
interface TasksFactoryBuilder {
    <TOptions extends TasksFactoryDefineOptions>(options?: TOptions): TasksFactoryInterface<{}, TasksTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends TasksTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends TasksFactoryDefineOptions<TTransients>>(options?: TOptions) => TasksFactoryInterface<TTransients, TasksTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link Tasks} model.
 *
 * @param options
 * @returns factory {@link TasksFactoryInterface}
 */
export declare const defineTasksFactory: TasksFactoryBuilder;
type OrganizationFactoryDefineInput = {
    id?: string;
    name?: string;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    clients?: Prisma.ClientCreateNestedManyWithoutOrganizationInput;
};
type OrganizationTransientFields = Record<string, unknown> & Partial<Record<keyof OrganizationFactoryDefineInput, never>>;
type OrganizationFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<OrganizationFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Organization, Prisma.OrganizationCreateInput, TTransients>;
type OrganizationFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<OrganizationFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: TraitName]: OrganizationFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Organization, Prisma.OrganizationCreateInput, TTransients>;
type OrganizationTraitKeys<TOptions extends OrganizationFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;
export interface OrganizationFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Organization";
    build(inputData?: Partial<Prisma.OrganizationCreateInput & TTransients>): PromiseLike<Prisma.OrganizationCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.OrganizationCreateInput & TTransients>): PromiseLike<Prisma.OrganizationCreateInput>;
    buildList(list: readonly Partial<Prisma.OrganizationCreateInput & TTransients>[]): PromiseLike<Prisma.OrganizationCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.OrganizationCreateInput & TTransients>): PromiseLike<Prisma.OrganizationCreateInput[]>;
    pickForConnect(inputData: Organization): Pick<Organization, "id">;
    create(inputData?: Partial<Prisma.OrganizationCreateInput & TTransients>): PromiseLike<Organization>;
    createList(list: readonly Partial<Prisma.OrganizationCreateInput & TTransients>[]): PromiseLike<Organization[]>;
    createList(count: number, item?: Partial<Prisma.OrganizationCreateInput & TTransients>): PromiseLike<Organization[]>;
    createForConnect(inputData?: Partial<Prisma.OrganizationCreateInput & TTransients>): PromiseLike<Pick<Organization, "id">>;
}
export interface OrganizationFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends OrganizationFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): OrganizationFactoryInterfaceWithoutTraits<TTransients>;
}
interface OrganizationFactoryBuilder {
    <TOptions extends OrganizationFactoryDefineOptions>(options?: TOptions): OrganizationFactoryInterface<{}, OrganizationTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends OrganizationTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends OrganizationFactoryDefineOptions<TTransients>>(options?: TOptions) => OrganizationFactoryInterface<TTransients, OrganizationTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link Organization} model.
 *
 * @param options
 * @returns factory {@link OrganizationFactoryInterface}
 */
export declare const defineOrganizationFactory: OrganizationFactoryBuilder;
type ClientorganizationFactory = {
    _factoryFor: "Organization";
    build: () => PromiseLike<Prisma.OrganizationCreateNestedOneWithoutClientsInput["create"]>;
};
type ClientparentFactory = {
    _factoryFor: "Client";
    build: () => PromiseLike<Prisma.ClientCreateNestedOneWithoutChildrenInput["create"]>;
};
type ClientFactoryDefineInput = {
    id?: string;
    name?: string;
    contactPerson?: string | null;
    email?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    organization: ClientorganizationFactory | Prisma.OrganizationCreateNestedOneWithoutClientsInput;
    parent?: ClientparentFactory | Prisma.ClientCreateNestedOneWithoutChildrenInput;
    children?: Prisma.ClientCreateNestedManyWithoutParentInput;
    users?: Prisma.UserCreateNestedManyWithoutClientInput;
    userClientRoles?: Prisma.UserClientRoleCreateNestedManyWithoutClientInput;
};
type ClientTransientFields = Record<string, unknown> & Partial<Record<keyof ClientFactoryDefineInput, never>>;
type ClientFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<ClientFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Client, Prisma.ClientCreateInput, TTransients>;
type ClientFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData: Resolver<ClientFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: ClientFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Client, Prisma.ClientCreateInput, TTransients>;
type ClientTraitKeys<TOptions extends ClientFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;
export interface ClientFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Client";
    build(inputData?: Partial<Prisma.ClientCreateInput & TTransients>): PromiseLike<Prisma.ClientCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.ClientCreateInput & TTransients>): PromiseLike<Prisma.ClientCreateInput>;
    buildList(list: readonly Partial<Prisma.ClientCreateInput & TTransients>[]): PromiseLike<Prisma.ClientCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.ClientCreateInput & TTransients>): PromiseLike<Prisma.ClientCreateInput[]>;
    pickForConnect(inputData: Client): Pick<Client, "id">;
    create(inputData?: Partial<Prisma.ClientCreateInput & TTransients>): PromiseLike<Client>;
    createList(list: readonly Partial<Prisma.ClientCreateInput & TTransients>[]): PromiseLike<Client[]>;
    createList(count: number, item?: Partial<Prisma.ClientCreateInput & TTransients>): PromiseLike<Client[]>;
    createForConnect(inputData?: Partial<Prisma.ClientCreateInput & TTransients>): PromiseLike<Pick<Client, "id">>;
}
export interface ClientFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends ClientFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): ClientFactoryInterfaceWithoutTraits<TTransients>;
}
interface ClientFactoryBuilder {
    <TOptions extends ClientFactoryDefineOptions>(options: TOptions): ClientFactoryInterface<{}, ClientTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends ClientTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends ClientFactoryDefineOptions<TTransients>>(options: TOptions) => ClientFactoryInterface<TTransients, ClientTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link Client} model.
 *
 * @param options
 * @returns factory {@link ClientFactoryInterface}
 */
export declare const defineClientFactory: ClientFactoryBuilder;
type UserclientFactory = {
    _factoryFor: "Client";
    build: () => PromiseLike<Prisma.ClientCreateNestedOneWithoutUsersInput["create"]>;
};
type UserFactoryDefineInput = {
    id?: string;
    username?: string;
    email?: string;
    passwordHash?: string;
    createdAt?: Date;
    updatedAt?: Date;
    client: UserclientFactory | Prisma.ClientCreateNestedOneWithoutUsersInput;
    applications?: Prisma.ApplicationCreateNestedManyWithoutUserInput;
    applicationHistories?: Prisma.ApplicationHistoryCreateNestedManyWithoutChangedByUserInput;
    userClientRoles?: Prisma.UserClientRoleCreateNestedManyWithoutUserInput;
    assignedUserClientRoles?: Prisma.UserClientRoleCreateNestedManyWithoutAssignedByUserInput;
    tasks?: Prisma.TasksCreateNestedManyWithoutUsersInput;
};
type UserTransientFields = Record<string, unknown> & Partial<Record<keyof UserFactoryDefineInput, never>>;
type UserFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<User, Prisma.UserCreateInput, TTransients>;
type UserFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData: Resolver<UserFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: UserFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<User, Prisma.UserCreateInput, TTransients>;
type UserTraitKeys<TOptions extends UserFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;
export interface UserFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "User";
    build(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput>;
    buildList(list: readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<Prisma.UserCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput[]>;
    pickForConnect(inputData: User): Pick<User, "id">;
    create(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<User>;
    createList(list: readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<User[]>;
    createList(count: number, item?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<User[]>;
    createForConnect(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Pick<User, "id">>;
}
export interface UserFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends UserFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): UserFactoryInterfaceWithoutTraits<TTransients>;
}
interface UserFactoryBuilder {
    <TOptions extends UserFactoryDefineOptions>(options: TOptions): UserFactoryInterface<{}, UserTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends UserTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends UserFactoryDefineOptions<TTransients>>(options: TOptions) => UserFactoryInterface<TTransients, UserTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link User} model.
 *
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
export declare const defineUserFactory: UserFactoryBuilder;
type ApplicationuserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutApplicationsInput["create"]>;
};
type ApplicationFactoryDefineInput = {
    id?: string;
    type?: ApplicationType;
    description?: string;
    applicationDate?: Date;
    updatedAt?: Date;
    user: ApplicationuserFactory | Prisma.UserCreateNestedOneWithoutApplicationsInput;
    histories?: Prisma.ApplicationHistoryCreateNestedManyWithoutApplicationInput;
};
type ApplicationTransientFields = Record<string, unknown> & Partial<Record<keyof ApplicationFactoryDefineInput, never>>;
type ApplicationFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<ApplicationFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Application, Prisma.ApplicationCreateInput, TTransients>;
type ApplicationFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData: Resolver<ApplicationFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: ApplicationFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Application, Prisma.ApplicationCreateInput, TTransients>;
type ApplicationTraitKeys<TOptions extends ApplicationFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;
export interface ApplicationFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Application";
    build(inputData?: Partial<Prisma.ApplicationCreateInput & TTransients>): PromiseLike<Prisma.ApplicationCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.ApplicationCreateInput & TTransients>): PromiseLike<Prisma.ApplicationCreateInput>;
    buildList(list: readonly Partial<Prisma.ApplicationCreateInput & TTransients>[]): PromiseLike<Prisma.ApplicationCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.ApplicationCreateInput & TTransients>): PromiseLike<Prisma.ApplicationCreateInput[]>;
    pickForConnect(inputData: Application): Pick<Application, "id">;
    create(inputData?: Partial<Prisma.ApplicationCreateInput & TTransients>): PromiseLike<Application>;
    createList(list: readonly Partial<Prisma.ApplicationCreateInput & TTransients>[]): PromiseLike<Application[]>;
    createList(count: number, item?: Partial<Prisma.ApplicationCreateInput & TTransients>): PromiseLike<Application[]>;
    createForConnect(inputData?: Partial<Prisma.ApplicationCreateInput & TTransients>): PromiseLike<Pick<Application, "id">>;
}
export interface ApplicationFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends ApplicationFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): ApplicationFactoryInterfaceWithoutTraits<TTransients>;
}
interface ApplicationFactoryBuilder {
    <TOptions extends ApplicationFactoryDefineOptions>(options: TOptions): ApplicationFactoryInterface<{}, ApplicationTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends ApplicationTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends ApplicationFactoryDefineOptions<TTransients>>(options: TOptions) => ApplicationFactoryInterface<TTransients, ApplicationTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link Application} model.
 *
 * @param options
 * @returns factory {@link ApplicationFactoryInterface}
 */
export declare const defineApplicationFactory: ApplicationFactoryBuilder;
type ApplicationHistoryapplicationFactory = {
    _factoryFor: "Application";
    build: () => PromiseLike<Prisma.ApplicationCreateNestedOneWithoutHistoriesInput["create"]>;
};
type ApplicationHistorychangedByUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutApplicationHistoriesInput["create"]>;
};
type ApplicationHistoryFactoryDefineInput = {
    id?: string;
    status?: ApplicationStatus;
    comment?: string | null;
    changeDate?: Date;
    application: ApplicationHistoryapplicationFactory | Prisma.ApplicationCreateNestedOneWithoutHistoriesInput;
    changedByUser?: ApplicationHistorychangedByUserFactory | Prisma.UserCreateNestedOneWithoutApplicationHistoriesInput;
};
type ApplicationHistoryTransientFields = Record<string, unknown> & Partial<Record<keyof ApplicationHistoryFactoryDefineInput, never>>;
type ApplicationHistoryFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<ApplicationHistoryFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<ApplicationHistory, Prisma.ApplicationHistoryCreateInput, TTransients>;
type ApplicationHistoryFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData: Resolver<ApplicationHistoryFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: ApplicationHistoryFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<ApplicationHistory, Prisma.ApplicationHistoryCreateInput, TTransients>;
type ApplicationHistoryTraitKeys<TOptions extends ApplicationHistoryFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;
export interface ApplicationHistoryFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "ApplicationHistory";
    build(inputData?: Partial<Prisma.ApplicationHistoryCreateInput & TTransients>): PromiseLike<Prisma.ApplicationHistoryCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.ApplicationHistoryCreateInput & TTransients>): PromiseLike<Prisma.ApplicationHistoryCreateInput>;
    buildList(list: readonly Partial<Prisma.ApplicationHistoryCreateInput & TTransients>[]): PromiseLike<Prisma.ApplicationHistoryCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.ApplicationHistoryCreateInput & TTransients>): PromiseLike<Prisma.ApplicationHistoryCreateInput[]>;
    pickForConnect(inputData: ApplicationHistory): Pick<ApplicationHistory, "id">;
    create(inputData?: Partial<Prisma.ApplicationHistoryCreateInput & TTransients>): PromiseLike<ApplicationHistory>;
    createList(list: readonly Partial<Prisma.ApplicationHistoryCreateInput & TTransients>[]): PromiseLike<ApplicationHistory[]>;
    createList(count: number, item?: Partial<Prisma.ApplicationHistoryCreateInput & TTransients>): PromiseLike<ApplicationHistory[]>;
    createForConnect(inputData?: Partial<Prisma.ApplicationHistoryCreateInput & TTransients>): PromiseLike<Pick<ApplicationHistory, "id">>;
}
export interface ApplicationHistoryFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends ApplicationHistoryFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): ApplicationHistoryFactoryInterfaceWithoutTraits<TTransients>;
}
interface ApplicationHistoryFactoryBuilder {
    <TOptions extends ApplicationHistoryFactoryDefineOptions>(options: TOptions): ApplicationHistoryFactoryInterface<{}, ApplicationHistoryTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends ApplicationHistoryTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends ApplicationHistoryFactoryDefineOptions<TTransients>>(options: TOptions) => ApplicationHistoryFactoryInterface<TTransients, ApplicationHistoryTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link ApplicationHistory} model.
 *
 * @param options
 * @returns factory {@link ApplicationHistoryFactoryInterface}
 */
export declare const defineApplicationHistoryFactory: ApplicationHistoryFactoryBuilder;
type RoleFactoryDefineInput = {
    id?: string;
    name?: string;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    permissions?: Prisma.PermissionCreateNestedManyWithoutRolesInput;
    userClientRoles?: Prisma.UserClientRoleCreateNestedManyWithoutRoleInput;
};
type RoleTransientFields = Record<string, unknown> & Partial<Record<keyof RoleFactoryDefineInput, never>>;
type RoleFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<RoleFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Role, Prisma.RoleCreateInput, TTransients>;
type RoleFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<RoleFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: TraitName]: RoleFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Role, Prisma.RoleCreateInput, TTransients>;
type RoleTraitKeys<TOptions extends RoleFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;
export interface RoleFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Role";
    build(inputData?: Partial<Prisma.RoleCreateInput & TTransients>): PromiseLike<Prisma.RoleCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.RoleCreateInput & TTransients>): PromiseLike<Prisma.RoleCreateInput>;
    buildList(list: readonly Partial<Prisma.RoleCreateInput & TTransients>[]): PromiseLike<Prisma.RoleCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.RoleCreateInput & TTransients>): PromiseLike<Prisma.RoleCreateInput[]>;
    pickForConnect(inputData: Role): Pick<Role, "id">;
    create(inputData?: Partial<Prisma.RoleCreateInput & TTransients>): PromiseLike<Role>;
    createList(list: readonly Partial<Prisma.RoleCreateInput & TTransients>[]): PromiseLike<Role[]>;
    createList(count: number, item?: Partial<Prisma.RoleCreateInput & TTransients>): PromiseLike<Role[]>;
    createForConnect(inputData?: Partial<Prisma.RoleCreateInput & TTransients>): PromiseLike<Pick<Role, "id">>;
}
export interface RoleFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends RoleFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): RoleFactoryInterfaceWithoutTraits<TTransients>;
}
interface RoleFactoryBuilder {
    <TOptions extends RoleFactoryDefineOptions>(options?: TOptions): RoleFactoryInterface<{}, RoleTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends RoleTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends RoleFactoryDefineOptions<TTransients>>(options?: TOptions) => RoleFactoryInterface<TTransients, RoleTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link Role} model.
 *
 * @param options
 * @returns factory {@link RoleFactoryInterface}
 */
export declare const defineRoleFactory: RoleFactoryBuilder;
type PermissionFactoryDefineInput = {
    id?: string;
    name?: string;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    roles?: Prisma.RoleCreateNestedManyWithoutPermissionsInput;
};
type PermissionTransientFields = Record<string, unknown> & Partial<Record<keyof PermissionFactoryDefineInput, never>>;
type PermissionFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<PermissionFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Permission, Prisma.PermissionCreateInput, TTransients>;
type PermissionFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<PermissionFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: TraitName]: PermissionFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Permission, Prisma.PermissionCreateInput, TTransients>;
type PermissionTraitKeys<TOptions extends PermissionFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;
export interface PermissionFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Permission";
    build(inputData?: Partial<Prisma.PermissionCreateInput & TTransients>): PromiseLike<Prisma.PermissionCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PermissionCreateInput & TTransients>): PromiseLike<Prisma.PermissionCreateInput>;
    buildList(list: readonly Partial<Prisma.PermissionCreateInput & TTransients>[]): PromiseLike<Prisma.PermissionCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.PermissionCreateInput & TTransients>): PromiseLike<Prisma.PermissionCreateInput[]>;
    pickForConnect(inputData: Permission): Pick<Permission, "id">;
    create(inputData?: Partial<Prisma.PermissionCreateInput & TTransients>): PromiseLike<Permission>;
    createList(list: readonly Partial<Prisma.PermissionCreateInput & TTransients>[]): PromiseLike<Permission[]>;
    createList(count: number, item?: Partial<Prisma.PermissionCreateInput & TTransients>): PromiseLike<Permission[]>;
    createForConnect(inputData?: Partial<Prisma.PermissionCreateInput & TTransients>): PromiseLike<Pick<Permission, "id">>;
}
export interface PermissionFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends PermissionFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): PermissionFactoryInterfaceWithoutTraits<TTransients>;
}
interface PermissionFactoryBuilder {
    <TOptions extends PermissionFactoryDefineOptions>(options?: TOptions): PermissionFactoryInterface<{}, PermissionTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends PermissionTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends PermissionFactoryDefineOptions<TTransients>>(options?: TOptions) => PermissionFactoryInterface<TTransients, PermissionTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link Permission} model.
 *
 * @param options
 * @returns factory {@link PermissionFactoryInterface}
 */
export declare const definePermissionFactory: PermissionFactoryBuilder;
type UserClientRoleuserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutUserClientRolesInput["create"]>;
};
type UserClientRoleclientFactory = {
    _factoryFor: "Client";
    build: () => PromiseLike<Prisma.ClientCreateNestedOneWithoutUserClientRolesInput["create"]>;
};
type UserClientRoleroleFactory = {
    _factoryFor: "Role";
    build: () => PromiseLike<Prisma.RoleCreateNestedOneWithoutUserClientRolesInput["create"]>;
};
type UserClientRoleassignedByUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutAssignedUserClientRolesInput["create"]>;
};
type UserClientRoleFactoryDefineInput = {
    id?: string;
    assignedAt?: Date;
    user: UserClientRoleuserFactory | Prisma.UserCreateNestedOneWithoutUserClientRolesInput;
    client: UserClientRoleclientFactory | Prisma.ClientCreateNestedOneWithoutUserClientRolesInput;
    role: UserClientRoleroleFactory | Prisma.RoleCreateNestedOneWithoutUserClientRolesInput;
    assignedByUser?: UserClientRoleassignedByUserFactory | Prisma.UserCreateNestedOneWithoutAssignedUserClientRolesInput;
};
type UserClientRoleTransientFields = Record<string, unknown> & Partial<Record<keyof UserClientRoleFactoryDefineInput, never>>;
type UserClientRoleFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<UserClientRoleFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<UserClientRole, Prisma.UserClientRoleCreateInput, TTransients>;
type UserClientRoleFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData: Resolver<UserClientRoleFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: UserClientRoleFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<UserClientRole, Prisma.UserClientRoleCreateInput, TTransients>;
type UserClientRoleTraitKeys<TOptions extends UserClientRoleFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;
export interface UserClientRoleFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "UserClientRole";
    build(inputData?: Partial<Prisma.UserClientRoleCreateInput & TTransients>): PromiseLike<Prisma.UserClientRoleCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.UserClientRoleCreateInput & TTransients>): PromiseLike<Prisma.UserClientRoleCreateInput>;
    buildList(list: readonly Partial<Prisma.UserClientRoleCreateInput & TTransients>[]): PromiseLike<Prisma.UserClientRoleCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.UserClientRoleCreateInput & TTransients>): PromiseLike<Prisma.UserClientRoleCreateInput[]>;
    pickForConnect(inputData: UserClientRole): Pick<UserClientRole, "id">;
    create(inputData?: Partial<Prisma.UserClientRoleCreateInput & TTransients>): PromiseLike<UserClientRole>;
    createList(list: readonly Partial<Prisma.UserClientRoleCreateInput & TTransients>[]): PromiseLike<UserClientRole[]>;
    createList(count: number, item?: Partial<Prisma.UserClientRoleCreateInput & TTransients>): PromiseLike<UserClientRole[]>;
    createForConnect(inputData?: Partial<Prisma.UserClientRoleCreateInput & TTransients>): PromiseLike<Pick<UserClientRole, "id">>;
}
export interface UserClientRoleFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends UserClientRoleFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): UserClientRoleFactoryInterfaceWithoutTraits<TTransients>;
}
interface UserClientRoleFactoryBuilder {
    <TOptions extends UserClientRoleFactoryDefineOptions>(options: TOptions): UserClientRoleFactoryInterface<{}, UserClientRoleTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends UserClientRoleTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends UserClientRoleFactoryDefineOptions<TTransients>>(options: TOptions) => UserClientRoleFactoryInterface<TTransients, UserClientRoleTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link UserClientRole} model.
 *
 * @param options
 * @returns factory {@link UserClientRoleFactoryInterface}
 */
export declare const defineUserClientRoleFactory: UserClientRoleFactoryBuilder;
