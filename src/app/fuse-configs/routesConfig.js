import React from 'react';
import { Redirect } from 'react-router-dom';
import { FuseUtils } from '@fuse/index';
// import {ExampleConfig} from 'app/main/example/ExampleConfig';
import { UsersAppConfig } from 'app/main/users/UsersAppConfig';
import { LoginConfig } from 'app/main/login/LoginConfig';
import { ForgotConfig } from 'app/main/forgot/ForgotConfig';
import { ResetPassword2PageConfig } from 'app/main/resetpassword/ResetPassword2PageConfig';
import { MailConfirmPageConfig } from 'app/main/mailconfirm/MailConfirmPageConfig';
import { RegisterConfig } from 'app/main/register/RegisterConfig';
import { LogoutConfig } from 'app/main/logout/LogoutConfig';
import { ProfilePageConfig } from 'app/main/profile/ProfilePageConfig'
import { SettingsConfig } from 'app/main/settings/SettingsConfig'
import { EventsConfig } from 'app/main/events/EventsConfig'
import { ChatAppConfig } from 'app/main/chat/ChatAppConfig'
import { DashboardAppConfig } from 'app/main/dashboard/DashboardAppConfig'
import { CreditAppConfig } from 'app/main/credit/CreditAppConfig'
import { CompanyConfig } from 'app/main/company/CompanyConfig'
import { BranchConfig } from 'app/main/branch/BranchConfig'
import { FiscalConfig } from 'app/main/fiscal/FiscalConfig'
import { UserRoleConfig } from 'app/main/userrole/UserRoleConfig'
import { RoleAssignmentConfig } from 'app/main/roleassignment/RoleAssignmentConfig'
import { GodownConfig } from 'app/main/Godown/GodownConfig';
import { JournalVoucherConfig } from 'app/main/journalvoucher/JournalVoucherConfig';
import { BankConfig } from '../main/Banking/BankConfig';
import { ProductGroupConfig } from '../main/productGroup/ProductGroupConfig';
import { ProductServiceConfig } from '../main/productservice/ProductServiceConfig';
import { UserLogConfig } from '../main/UserLog/UserLog.config';
import { SalesConfig } from '../main/Sales/Sales.Config';
import { EstiateConfig } from '../main/Estimate/Estimate.Config';
import { PurchaseConfig } from '../main/Purchase/Purchase.Config';
import { ProjectConfig } from '../main/ProjectManagement/Project.Config';
import { UnitConfig } from '../main/UnitManagement/Unit.Config';
import { TaxConfig } from '../main/Taxs/Tax.Config';
import { AccountingConfig } from '../main/Accounting/Accounting.Config';
import { AutoNumberingConfig } from '../main/AutoNumbering/AutoNumber.Config';
import { ChartOfAccountConfig } from '../main/ChartOfAccount/ChartOfAccount.Config';
import { PayRollConfig } from '../main/PayRoll/Sales.Config';
import { SmsConfig } from '../main/Sms/Sms.Config';
import { BudgetConfig } from '../main/Budget/Budget.Config';
import { ReceivePaymentConfig } from '../main/ReceivePaymet/ReceivePayment.Config';
import { StockAdjustmentConfig } from '../main/StockAdjustment/StockAdjustment.Config';
import { AttachmentConfig } from '../main/Attachment/AttachmentConfig';
import {TestConfig} from 'app/main/Test/TestConfig';
import {statementConfig} from 'app/main/Statement/statementConfig';


const routeConfigs = [
  DashboardAppConfig,
  UsersAppConfig,
  LoginConfig,
  ForgotConfig,
  MailConfirmPageConfig,
  ResetPassword2PageConfig,
  RegisterConfig,
  LogoutConfig,
  ProfilePageConfig,
  SettingsConfig,
  EventsConfig,
  ChatAppConfig,
  CreditAppConfig,
  CompanyConfig,
  BranchConfig,
  FiscalConfig,
  UserRoleConfig,
  RoleAssignmentConfig,
  ProductServiceConfig,
  GodownConfig,
  JournalVoucherConfig,
  BankConfig,
  ProductGroupConfig,
  UserLogConfig,
  SalesConfig,
  PurchaseConfig,
  ProjectConfig,
  UnitConfig,
  TaxConfig,
  AccountingConfig,
  AutoNumberingConfig,
  ChartOfAccountConfig,
  PayRollConfig,
  SmsConfig,
  BudgetConfig,
  EstiateConfig,
  ReceivePaymentConfig,
  StockAdjustmentConfig,
  AttachmentConfig,
  TestConfig,
  statementConfig
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
  {
    path: '/',
    component: () => <Redirect to="/dashboard" />
  }
];

export default routes;
