import DashboardController from './DashboardController'
import AdminUserController from './AdminUserController'
import MemberController from './MemberController'
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
    DashboardController: Object.assign(DashboardController, DashboardController),
    AdminUserController: Object.assign(AdminUserController, AdminUserController),
    MemberController: Object.assign(MemberController, MemberController),
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