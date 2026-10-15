import InstitutionalLandingController from './InstitutionalLandingController'
import InstitutionalPageAdminController from './InstitutionalPageAdminController'
import DashboardController from './DashboardController'
import FeedController from './FeedController'
import FeedInteractionController from './FeedInteractionController'
import BirthdayPostController from './BirthdayPostController'
import MemberProfileController from './MemberProfileController'
import UserProfileController from './UserProfileController'
import MemberProfileContactsController from './MemberProfileContactsController'
import MemberProfileMotorcycleController from './MemberProfileMotorcycleController'
import TableQueryController from './TableQueryController'
import RegionalContextController from './RegionalContextController'
import RegionalController from './RegionalController'
import AdminUserController from './AdminUserController'
import AccessGroupController from './AccessGroupController'
import MemberAccountController from './MemberAccountController'
import MemberController from './MemberController'
import PublicProfileController from './PublicProfileController'
import MemberMotorcycleController from './MemberMotorcycleController'
import ClubRoleController from './ClubRoleController'
import RoleAssignmentController from './RoleAssignmentController'
import BillingPeriodController from './BillingPeriodController'
import FeeGenerationController from './FeeGenerationController'
import FeeController from './FeeController'
import FeeAdjustmentController from './FeeAdjustmentController'
import PaymentController from './PaymentController'
import CashController from './CashController'
import CashMovementController from './CashMovementController'
import ReceiptController from './ReceiptController'
import ReportController from './ReportController'
import Settings from './Settings'

const Controllers = {
    InstitutionalLandingController: Object.assign(InstitutionalLandingController, InstitutionalLandingController),
    InstitutionalPageAdminController: Object.assign(InstitutionalPageAdminController, InstitutionalPageAdminController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    FeedController: Object.assign(FeedController, FeedController),
    FeedInteractionController: Object.assign(FeedInteractionController, FeedInteractionController),
    BirthdayPostController: Object.assign(BirthdayPostController, BirthdayPostController),
    MemberProfileController: Object.assign(MemberProfileController, MemberProfileController),
    UserProfileController: Object.assign(UserProfileController, UserProfileController),
    MemberProfileContactsController: Object.assign(MemberProfileContactsController, MemberProfileContactsController),
    MemberProfileMotorcycleController: Object.assign(MemberProfileMotorcycleController, MemberProfileMotorcycleController),
    TableQueryController: Object.assign(TableQueryController, TableQueryController),
    RegionalContextController: Object.assign(RegionalContextController, RegionalContextController),
    RegionalController: Object.assign(RegionalController, RegionalController),
    AdminUserController: Object.assign(AdminUserController, AdminUserController),
    AccessGroupController: Object.assign(AccessGroupController, AccessGroupController),
    MemberAccountController: Object.assign(MemberAccountController, MemberAccountController),
    MemberController: Object.assign(MemberController, MemberController),
    PublicProfileController: Object.assign(PublicProfileController, PublicProfileController),
    MemberMotorcycleController: Object.assign(MemberMotorcycleController, MemberMotorcycleController),
    ClubRoleController: Object.assign(ClubRoleController, ClubRoleController),
    RoleAssignmentController: Object.assign(RoleAssignmentController, RoleAssignmentController),
    BillingPeriodController: Object.assign(BillingPeriodController, BillingPeriodController),
    FeeGenerationController: Object.assign(FeeGenerationController, FeeGenerationController),
    FeeController: Object.assign(FeeController, FeeController),
    FeeAdjustmentController: Object.assign(FeeAdjustmentController, FeeAdjustmentController),
    PaymentController: Object.assign(PaymentController, PaymentController),
    CashController: Object.assign(CashController, CashController),
    CashMovementController: Object.assign(CashMovementController, CashMovementController),
    ReceiptController: Object.assign(ReceiptController, ReceiptController),
    ReportController: Object.assign(ReportController, ReportController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers