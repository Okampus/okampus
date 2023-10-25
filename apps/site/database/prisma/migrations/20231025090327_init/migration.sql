-- CreateEnum
CREATE TYPE "Colors" AS ENUM ('Blue', 'DeepBlue', 'DarkBlue', 'LightBlue', 'Green', 'DeepGreen', 'DarkGreen', 'LightGreen', 'Orange', 'DeepOrange', 'DarkOrange', 'LightOrange', 'Red', 'DeepRed', 'DarkRed', 'LightRed', 'Purple', 'DeepPurple', 'DarkPurple', 'LightPurple', 'Gray', 'DeepGray', 'DarkGray', 'Turquoise', 'Pink', 'Cyan', 'Brown', 'Indigo', 'Lime', 'Teal', 'Transparent');

-- CreateEnum
CREATE TYPE "ApprovalState" AS ENUM ('Approved', 'Rejected', 'Pending', 'Canceled');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('LegalUnit', 'Team', 'Tenant', 'User');

-- CreateEnum
CREATE TYPE "ActorImageType" AS ENUM ('Avatar', 'Banner', 'Gallery');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('Primary', 'Secondary', 'Cash');

-- CreateEnum
CREATE TYPE "EventState" AS ENUM ('Template', 'Draft', 'Submitted', 'Rejected', 'Approved', 'Published', 'Canceled');

-- CreateEnum
CREATE TYPE "ProcessedVia" AS ENUM ('Automatic', 'Manual', 'QR');

-- CreateEnum
CREATE TYPE "LegalUnitType" AS ENUM ('Bank', 'Company', 'Association', 'TenantGrantFund');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('Address', 'Campus', 'Online', 'Unspecificed');

-- CreateEnum
CREATE TYPE "LogContext" AS ENUM ('User', 'Bot', 'CRON', 'Seeding', 'System');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('Create', 'Update', 'Delete', 'Hide');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('Event', 'EventRegular', 'EventRange', 'Internal', 'Other');

-- CreateEnum
CREATE TYPE "SocialType" AS ENUM ('Discord', 'GitHub', 'TikTok', 'LinkedIn', 'Instagram', 'Facebook', 'Twitch', 'WhatsApp', 'YouTube');

-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('Transaction', 'Category', 'ClassGroup', 'Cohort', 'Tag');

-- CreateEnum
CREATE TYPE "TeamType" AS ENUM ('Association', 'Club', 'Project');

-- CreateEnum
CREATE TYPE "ApproximateDate" AS ENUM ('Exact', 'Year', 'Month', 'Day', 'Time');

-- CreateEnum
CREATE TYPE "TeamHistoryType" AS ENUM ('Defunct', 'Restart', 'ActivityEnd', 'AcitivityStart', 'LegalStart', 'LegalEnd', 'RegularAssembly', 'ExtraordinaryAssembly', 'OkampusEnd', 'OkampusStart');

-- CreateEnum
CREATE TYPE "TeamRoleType" AS ENUM ('President', 'Treasurer', 'Secretary', 'DirectorRole', 'ManagerRole');

-- CreateEnum
CREATE TYPE "TenantRoleType" AS ENUM ('Administration', 'Student', 'Teacher');

-- CreateEnum
CREATE TYPE "ProcessedByType" AS ENUM ('Automatic', 'Unknown', 'Outsider', 'Manual');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Cash', 'Check', 'DirectDebit', 'Transfer', 'CreditCard', 'MobilePayment', 'Other');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Subvention', 'Reimbursement', 'MembershipPrice', 'TicketPrice', 'Other');

-- CreateEnum
CREATE TYPE "CountryCode" AS ENUM ('AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KR', 'KP', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'T1', 'VN', 'VG', 'VI', 'XX', 'WF', 'EH', 'YE', 'ZA', 'ZM', 'ZW');

-- CreateTable
CREATE TABLE "action" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "points" SMALLINT,
    "state" "ApprovalState" NOT NULL,
    "processedById" BIGINT,
    "processedAt" TIMESTAMPTZ(0),
    "teamId" BIGINT,
    "userId" BIGINT NOT NULL,
    "eventJoinId" BIGINT,
    "projectId" BIGINT,

    CONSTRAINT "action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actor" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT,
    "type" "ActorType" NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "banner" TEXT,
    "status" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "email" TEXT,
    "website" TEXT,
    "ical" TEXT NOT NULL DEFAULT id_generator(21),

    CONSTRAINT "actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actor_image" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT,
    "actorId" BIGINT NOT NULL,
    "imageId" BIGINT NOT NULL,
    "type" "ActorImageType" NOT NULL,

    CONSTRAINT "actor_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actor_tag" (
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "createdById" BIGINT,
    "actorId" BIGINT NOT NULL,
    "tagId" BIGINT NOT NULL,

    CONSTRAINT "actor_tag_pkey" PRIMARY KEY ("actorId","tagId")
);

-- CreateTable
CREATE TABLE "admin_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "userId" BIGINT NOT NULL,
    "tenantId" BIGINT,
    "canCreateTenant" BOOLEAN NOT NULL DEFAULT false,
    "canManageTenantEntities" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteTenantEntities" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "admin_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_account" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "type" "BankAccountType" NOT NULL DEFAULT 'Primary',
    "name" TEXT,
    "parentId" BIGINT,
    "bankInfoId" BIGINT,
    "teamId" BIGINT NOT NULL,

    CONSTRAINT "bank_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_info" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT,
    "bicSwift" TEXT NOT NULL,
    "holderName" TEXT NOT NULL DEFAULT '',
    "iban" TEXT NOT NULL,
    "actorId" BIGINT NOT NULL,
    "bankId" BIGINT NOT NULL,
    "branchAddressId" TEXT NOT NULL,

    CONSTRAINT "bank_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campus" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "hiddenAt" TIMESTAMPTZ(0),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locationId" BIGINT NOT NULL,
    "campusClusterId" BIGINT NOT NULL,

    CONSTRAINT "campus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campus_cluster" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "hiddenAt" TIMESTAMPTZ(0),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "campus_cluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "hiddenAt" TIMESTAMPTZ(0),
    "start" TIMESTAMPTZ(0) NOT NULL,
    "end" TIMESTAMPTZ(0) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "price" REAL NOT NULL DEFAULT 0,
    "pointsAwardedForAttendance" REAL NOT NULL DEFAULT 0,
    "maxParticipants" SMALLINT,
    "state" "EventState" NOT NULL DEFAULT 'Draft',
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isAutoAcceptingJoins" BOOLEAN NOT NULL DEFAULT true,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "locationDetails" TEXT NOT NULL DEFAULT '',
    "locationId" BIGINT NOT NULL,
    "eventApprovalSubmissionId" BIGINT,
    "bannerId" BIGINT,
    "joinFormId" BIGINT,
    "nextApprovalStepId" BIGINT,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_approval" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "hiddenAt" TIMESTAMPTZ(0),
    "message" TEXT NOT NULL DEFAULT '',
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "eventId" BIGINT,
    "eventApprovalStepId" BIGINT,

    CONSTRAINT "event_approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_approval_step" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "hiddenAt" TIMESTAMPTZ(0),
    "name" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL DEFAULT '',
    "previousStepId" BIGINT,

    CONSTRAINT "event_approval_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_approval_validator" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "stepId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,
    "canValidate" BOOLEAN NOT NULL DEFAULT false,
    "isNotified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "event_approval_validator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_favorite" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "eventId" BIGINT NOT NULL,

    CONSTRAINT "event_favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_join" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "state" "ApprovalState" NOT NULL DEFAULT 'Pending',
    "isPresent" BOOLEAN,
    "processedById" BIGINT,
    "processedAt" TIMESTAMPTZ(0),
    "participationProcessedById" BIGINT,
    "participationProcessedAt" TIMESTAMPTZ(0),
    "participationProcessedVia" "ProcessedVia",
    "eventId" BIGINT NOT NULL,
    "joinedById" BIGINT NOT NULL,
    "qrCodeId" BIGINT,
    "missionJoinId" BIGINT,
    "joinFormSubmissionId" BIGINT,

    CONSTRAINT "event_join_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_organize" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "eventId" BIGINT NOT NULL,
    "teamId" BIGINT NOT NULL,
    "projectId" BIGINT,

    CONSTRAINT "event_organize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_supervisor" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "title" TEXT,
    "userId" BIGINT NOT NULL,
    "eventOrganizeId" BIGINT NOT NULL,

    CONSTRAINT "event_supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "hiddenAt" TIMESTAMPTZ(0),
    "description" TEXT NOT NULL,
    "state" "ApprovalState" NOT NULL DEFAULT 'Pending',
    "lastNotifiedAt" TIMESTAMPTZ(0),
    "processedById" BIGINT,
    "processedAt" TIMESTAMPTZ(0),
    "expenseReportId" BIGINT NOT NULL,
    "bankInfoId" BIGINT NOT NULL,

    CONSTRAINT "expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_item" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "unitCost" REAL NOT NULL,
    "quantity" SMALLINT NOT NULL,
    "payedAt" TIMESTAMPTZ(0),
    "companyId" BIGINT,
    "expenseId" BIGINT,

    CONSTRAINT "expense_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_upload" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT,
    "linkedFormSubmissionId" BIGINT,
    "grantId" BIGINT,
    "grantAllocateId" BIGINT,
    "expenseItemId" BIGINT,
    "formSubmissionId" BIGINT,
    "locationId" BIGINT,
    "transactionId" BIGINT,
    "hiddenAt" TIMESTAMPTZ(0),
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "file_upload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "followedActorId" BIGINT NOT NULL,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "hiddenAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "schema" JSONB NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isAllowingMultipleAnswers" BOOLEAN NOT NULL DEFAULT false,
    "isAllowingEditingAnswers" BOOLEAN NOT NULL DEFAULT true,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_submission" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "submission" JSONB NOT NULL,
    "formId" BIGINT NOT NULL,

    CONSTRAINT "form_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grant" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "askedAmount" REAL NOT NULL,
    "receivedAmount" REAL NOT NULL,
    "state" "ApprovalState" NOT NULL DEFAULT 'Pending',
    "receivedAmountProcessedById" BIGINT,
    "receivedAmountProcessedAt" TIMESTAMPTZ(0),
    "teamId" BIGINT NOT NULL,
    "signatureId" BIGINT,
    "generatedDocumentId" BIGINT,

    CONSTRAINT "grant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grant_allocate" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "askedAmount" REAL NOT NULL,
    "receivedAmount" REAL,
    "state" "ApprovalState" NOT NULL DEFAULT 'Pending',
    "receivedAmountProcessedById" BIGINT,
    "receivedAmountProcessedAt" TIMESTAMPTZ(0),
    "grantId" BIGINT NOT NULL,
    "transactionId" BIGINT,
    "signatureId" BIGINT,
    "generatedDocumentId" BIGINT,

    CONSTRAINT "grant_allocate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_unit" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "slug" TEXT NOT NULL,
    "type" "LegalUnitType" NOT NULL,
    "siren" VARCHAR(255),
    "nic" VARCHAR(255),
    "legalCategory" VARCHAR(255),
    "activityCategory" VARCHAR(255),
    "legalName" VARCHAR(255) NOT NULL,
    "isFranchise" BOOLEAN NOT NULL DEFAULT false,
    "isFranchiseBrand" BOOLEAN NOT NULL DEFAULT false,
    "bankCode" INTEGER,
    "actorId" BIGINT NOT NULL,
    "parentId" BIGINT,
    "locationId" BIGINT,
    "bankLocationCode" INTEGER,

    CONSTRAINT "legal_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "hiddenAt" TIMESTAMPTZ(0),
    "type" "LocationType" NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "link" TEXT NOT NULL DEFAULT '',
    "actorId" BIGINT NOT NULL,
    "geoapifyId" TEXT,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "type" "LogType" NOT NULL,
    "context" "LogContext" NOT NULL,
    "diff" JSONB NOT NULL DEFAULT '{}',
    "entityName" TEXT NOT NULL,
    "entityId" BIGINT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "teamId" BIGINT,
    "transactionId" BIGINT,
    "eventId" BIGINT,
    "userId" BIGINT,
    "tenantId" BIGINT,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "pointsMinimum" SMALLINT NOT NULL,
    "pointsMaximum" SMALLINT NOT NULL,
    "quantity" SMALLINT NOT NULL DEFAULT 1,
    "isAutoAcceptingMembers" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "color" "Colors" NOT NULL DEFAULT 'Blue',
    "teamId" BIGINT NOT NULL,
    "eventOrganizeId" BIGINT,
    "projectId" BIGINT,

    CONSTRAINT "mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_join" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "state" "ApprovalState" NOT NULL DEFAULT 'Pending',
    "points" SMALLINT,
    "processedById" BIGINT,
    "processedAt" TIMESTAMPTZ(0),
    "pointsProcessedById" BIGINT,
    "pointsProcessedAt" TIMESTAMPTZ(0),
    "missionId" BIGINT NOT NULL,
    "joinedById" BIGINT NOT NULL,
    "projectId" BIGINT,
    "eventJoinId" BIGINT,

    CONSTRAINT "mission_join_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "hiddenAt" TIMESTAMPTZ(0),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL,
    "color" "Colors" NOT NULL DEFAULT 'Blue',
    "type" "ProjectType" NOT NULL DEFAULT 'Other',
    "regularEventInterval" TEXT NOT NULL DEFAULT '',
    "start" TIMESTAMPTZ(0),
    "end" TIMESTAMPTZ(0),
    "budget" REAL NOT NULL DEFAULT 0,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "teamId" BIGINT NOT NULL,
    "bannerId" BIGINT,
    "grantId" BIGINT,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_supervisor" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "title" TEXT,
    "userId" BIGINT NOT NULL,
    "projectId" BIGINT NOT NULL,

    CONSTRAINT "project_supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "required_document" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "hiddenAt" TIMESTAMPTZ(0),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "teamTypes" "TeamType"[] DEFAULT ARRAY[]::"TeamType"[],
    "isRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "required_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "required_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "hiddenAt" TIMESTAMPTZ(0),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "teamTypes" "TeamType"[] DEFAULT ARRAY[]::"TeamType"[],
    "isRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "required_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" VARCHAR(255) NOT NULL,
    "device" JSONB NOT NULL,
    "country" "CountryCode" NOT NULL,
    "refreshTokenHash" VARCHAR(255) NOT NULL,
    "tokenFamily" VARCHAR(255) NOT NULL,
    "userId" BIGINT NOT NULL,
    "lastActivityAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastIssuedAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "expiredAt" TIMESTAMPTZ(0),

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "actorId" BIGINT NOT NULL,
    "order" SMALLINT NOT NULL,
    "type" "SocialType" NOT NULL,
    "pseudo" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "hiddenAt" TIMESTAMPTZ(0),
    "type" "TagType" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "iconId" BIGINT,
    "ownerActorId" BIGINT,
    "color" "Colors" NOT NULL DEFAULT 'Transparent',

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "hiddenAt" TIMESTAMPTZ(0),
    "type" "TeamType" NOT NULL DEFAULT 'Club',
    "slug" TEXT NOT NULL,
    "membershipFees" REAL NOT NULL DEFAULT 0,
    "membershipDuration" TEXT NOT NULL DEFAULT '',
    "directorsCategoryName" TEXT NOT NULL DEFAULT 'Directors',
    "managersCategoryName" TEXT NOT NULL DEFAULT 'Managers',
    "membersCategoryName" TEXT NOT NULL DEFAULT 'Members',
    "expectingPresidentEmail" TEXT,
    "expectingTreasurerEmail" TEXT,
    "expectingSecretaryEmail" TEXT,
    "isOnboardingComplete" BOOLEAN NOT NULL DEFAULT true,
    "isJoinFormActive" BOOLEAN NOT NULL DEFAULT true,
    "joinFormId" BIGINT,
    "actorId" BIGINT NOT NULL,
    "tenantGrantFundId" BIGINT,
    "videoId" BIGINT,
    "parentId" BIGINT,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_document" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "yearVersion" SMALLINT,
    "fileUploadId" BIGINT,
    "teamId" BIGINT NOT NULL,
    "requiredDocumentId" BIGINT,

    CONSTRAINT "team_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_history" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "happenedAt" TIMESTAMPTZ(0) NOT NULL,
    "tenantScopeId" BIGINT NOT NULL,
    "approximateDate" "ApproximateDate" NOT NULL,
    "type" "TeamHistoryType" NOT NULL,
    "teamId" BIGINT NOT NULL,

    CONSTRAINT "team_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_join" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "state" "ApprovalState" NOT NULL DEFAULT 'Pending',
    "processedById" BIGINT,
    "processedAt" TIMESTAMPTZ(0),
    "joinFormSubmissionId" BIGINT,
    "joinedById" BIGINT NOT NULL,
    "teamId" BIGINT NOT NULL,
    "tenantScopeId" BIGINT NOT NULL,

    CONSTRAINT "team_join_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_member" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "teamId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "team_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_member_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "teamMemberId" BIGINT NOT NULL,
    "teamRoleId" BIGINT NOT NULL,

    CONSTRAINT "team_member_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_required_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "teamMemberId" BIGINT NOT NULL,
    "requiredRoleId" BIGINT NOT NULL,

    CONSTRAINT "team_required_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "teamId" BIGINT NOT NULL,
    "managerId" BIGINT,
    "color" "Colors" NOT NULL DEFAULT 'Blue',
    "type" "TeamRoleType",
    "isPole" BOOLEAN NOT NULL DEFAULT false,
    "canManageProfile" BOOLEAN NOT NULL DEFAULT false,
    "canViewTreasury" BOOLEAN NOT NULL DEFAULT false,
    "canManageTreasury" BOOLEAN NOT NULL DEFAULT false,
    "canViewJoins" BOOLEAN NOT NULL DEFAULT false,
    "canManageJoins" BOOLEAN NOT NULL DEFAULT false,
    "canManageMemberRoles" BOOLEAN NOT NULL DEFAULT false,
    "canManageRoles" BOOLEAN NOT NULL DEFAULT false,
    "canCreateEvents" BOOLEAN NOT NULL DEFAULT false,
    "canManageEvents" BOOLEAN NOT NULL DEFAULT false,
    "canViewDraftEvents" BOOLEAN NOT NULL DEFAULT false,
    "canCreateActions" BOOLEAN NOT NULL DEFAULT false,
    "canManageActions" BOOLEAN NOT NULL DEFAULT false,
    "canCreateContents" BOOLEAN NOT NULL DEFAULT false,
    "canManageContents" BOOLEAN NOT NULL DEFAULT false,
    "canManageDocuments" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "team_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "domain" TEXT NOT NULL,
    "pointName" TEXT NOT NULL,
    "isOidcEnabled" BOOLEAN NOT NULL DEFAULT false,
    "oidcName" TEXT NOT NULL DEFAULT '',
    "oidcClientId" TEXT NOT NULL DEFAULT '',
    "oidcClientSecret" TEXT NOT NULL DEFAULT '',
    "oidcDiscoveryUrl" TEXT NOT NULL DEFAULT '',
    "oidcScopes" TEXT NOT NULL DEFAULT '',
    "oidcCallbackUri" TEXT NOT NULL DEFAULT '',
    "eventValidationFormId" BIGINT,
    "actorId" BIGINT NOT NULL,

    CONSTRAINT "tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_member" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "tenant_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_member_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantMemberId" BIGINT NOT NULL,
    "tenantRoleId" BIGINT NOT NULL,

    CONSTRAINT "tenant_member_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_role" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "color" "Colors" NOT NULL DEFAULT 'Blue',
    "type" "TenantRoleType" NOT NULL DEFAULT 'Student',
    "canViewHidden" BOOLEAN NOT NULL DEFAULT false,
    "canHide" BOOLEAN NOT NULL DEFAULT false,
    "canCreateTeam" BOOLEAN NOT NULL DEFAULT false,
    "canManageCampus" BOOLEAN NOT NULL DEFAULT false,
    "canManageEventApprovalSteps" BOOLEAN NOT NULL DEFAULT false,
    "canManageEventApprovals" BOOLEAN NOT NULL DEFAULT false,
    "canManageTenant" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tenant_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_tag" (
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(0),
    "createdById" BIGINT,
    "actorId" BIGINT NOT NULL,
    "tagId" BIGINT NOT NULL,

    CONSTRAINT "transaction_tag_pkey" PRIMARY KEY ("actorId","tagId")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "tenantScopeId" BIGINT,
    "description" TEXT NOT NULL DEFAULT '',
    "amount" REAL NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "method" "PaymentMethod" NOT NULL,
    "state" "ApprovalState" NOT NULL DEFAULT 'Approved',
    "type" "TransactionType" NOT NULL,
    "payedById" BIGINT NOT NULL,
    "receivedById" BIGINT NOT NULL,
    "processedById" BIGINT,
    "processedByType" "ProcessedByType" NOT NULL DEFAULT 'Manual',
    "payedAt" TIMESTAMPTZ(0) NOT NULL,
    "bankAccountId" BIGINT NOT NULL,
    "expenseId" BIGINT,
    "eventId" BIGINT,
    "locationId" BIGINT,
    "projectId" BIGINT,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" BIGINT NOT NULL DEFAULT snowflake(),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" BIGINT,
    "deletedAt" TIMESTAMPTZ(0),
    "originalTenantScopeId" BIGINT NOT NULL,
    "hiddenAt" TIMESTAMPTZ(0),
    "slug" TEXT NOT NULL,
    "passwordHash" TEXT,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "actorId" BIGINT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "points" REAL NOT NULL DEFAULT 0,
    "isOnboardingFinished" BOOLEAN NOT NULL DEFAULT false,
    "isIntroductionFinished" BOOLEAN NOT NULL DEFAULT false,
    "isDarkModePreferred" BOOLEAN NOT NULL DEFAULT false,
    "isDataExportedOnDeactivation" BOOLEAN NOT NULL DEFAULT true,
    "isDataAnonymizedOnDeactivation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "geoapifyId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" REAL,
    "longitude" REAL,
    "category" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "streetNumber" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT '',
    "country" "CountryCode" NOT NULL DEFAULT 'FR',

    CONSTRAINT "address_pkey" PRIMARY KEY ("geoapifyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "actor_ical_unique" ON "actor"("ical");

-- CreateIndex
CREATE UNIQUE INDEX "actor_image_image_id_unique" ON "actor_image"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "event_slug_unique" ON "event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_event_approval_submission_id_unique" ON "event"("eventApprovalSubmissionId");

-- CreateIndex
CREATE UNIQUE INDEX "event_join_form_id_unique" ON "event"("joinFormId");

-- CreateIndex
CREATE INDEX "event_is_private_index" ON "event"("isPrivate");

-- CreateIndex
CREATE UNIQUE INDEX "event_join_form_submission_id_unique" ON "event_join"("joinFormSubmissionId");

-- CreateIndex
CREATE UNIQUE INDEX "file_upload_url_unique" ON "file_upload"("url");

-- CreateIndex
CREATE UNIQUE INDEX "grant_signature_id_unique" ON "grant"("signatureId");

-- CreateIndex
CREATE UNIQUE INDEX "grant_generated_document_id_unique" ON "grant"("generatedDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "grant_allocate_signature_id_unique" ON "grant_allocate"("signatureId");

-- CreateIndex
CREATE UNIQUE INDEX "grant_allocate_generated_document_id_unique" ON "grant_allocate"("generatedDocumentId");

-- CreateIndex
CREATE UNIQUE INDEX "legal_unit_slug_unique" ON "legal_unit"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "legal_unit_actor_id_unique" ON "legal_unit"("actorId");

-- CreateIndex
CREATE UNIQUE INDEX "team_slug_unique" ON "team"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "team_join_form_id_unique" ON "team"("joinFormId");

-- CreateIndex
CREATE UNIQUE INDEX "team_actor_id_unique" ON "team"("actorId");

-- CreateIndex
CREATE UNIQUE INDEX "team_document_file_id_unique" ON "team_document"("fileUploadId");

-- CreateIndex
CREATE UNIQUE INDEX "team_join_form_submission_id_unique" ON "team_join"("joinFormSubmissionId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_domain_unique" ON "tenant"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_oidc_name_unique" ON "tenant"("oidcName");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_event_validation_form_id_unique" ON "tenant"("eventValidationFormId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_actor_id_unique" ON "tenant"("actorId");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_expense_id_unique" ON "transaction"("expenseId");

-- CreateIndex
CREATE UNIQUE INDEX "user_slug_unique" ON "user"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_actor_id_unique" ON "user"("actorId");

-- AddForeignKey
ALTER TABLE "action" ADD CONSTRAINT "action_event_join_id_foreign" FOREIGN KEY ("eventJoinId") REFERENCES "event_join"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action" ADD CONSTRAINT "action_processed_by_id_foreign" FOREIGN KEY ("processedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action" ADD CONSTRAINT "action_project_id_foreign" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action" ADD CONSTRAINT "action_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action" ADD CONSTRAINT "action_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action" ADD CONSTRAINT "action_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "action" ADD CONSTRAINT "action_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor" ADD CONSTRAINT "actor_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor" ADD CONSTRAINT "actor_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_image" ADD CONSTRAINT "actor_image_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_image" ADD CONSTRAINT "actor_image_image_id_foreign" FOREIGN KEY ("imageId") REFERENCES "file_upload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_image" ADD CONSTRAINT "actor_image_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_image" ADD CONSTRAINT "actor_image_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_tag" ADD CONSTRAINT "actor_tag_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_tag" ADD CONSTRAINT "actor_tag_tag_id_foreign" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actor_tag" ADD CONSTRAINT "actor_tag_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role" ADD CONSTRAINT "admin_role_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role" ADD CONSTRAINT "admin_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_role" ADD CONSTRAINT "admin_role_tenant_id_foreign" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account" ADD CONSTRAINT "bank_account_bank_info_id_foreign" FOREIGN KEY ("bankInfoId") REFERENCES "bank_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account" ADD CONSTRAINT "bank_account_parent_id_foreign" FOREIGN KEY ("parentId") REFERENCES "bank_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account" ADD CONSTRAINT "bank_account_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account" ADD CONSTRAINT "bank_account_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account" ADD CONSTRAINT "bank_account_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_info" ADD CONSTRAINT "bank_info_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_info" ADD CONSTRAINT "bank_info_bank_id_foreign" FOREIGN KEY ("bankId") REFERENCES "legal_unit"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_info" ADD CONSTRAINT "bank_info_branch_address_id_foreign" FOREIGN KEY ("branchAddressId") REFERENCES "address"("geoapifyId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_info" ADD CONSTRAINT "bank_info_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_info" ADD CONSTRAINT "bank_info_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campus" ADD CONSTRAINT "campus_campus_cluster_id_foreign" FOREIGN KEY ("campusClusterId") REFERENCES "campus_cluster"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campus" ADD CONSTRAINT "campus_location_id_foreign" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campus" ADD CONSTRAINT "campus_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campus" ADD CONSTRAINT "campus_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campus_cluster" ADD CONSTRAINT "campus_cluster_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campus_cluster" ADD CONSTRAINT "campus_cluster_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_event_approval_submission_id_foreign" FOREIGN KEY ("eventApprovalSubmissionId") REFERENCES "form_submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_banner_id_foreign" FOREIGN KEY ("bannerId") REFERENCES "file_upload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_location_id_foreign" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_next_event_approval_step_id_foreign" FOREIGN KEY ("nextApprovalStepId") REFERENCES "event_approval_step"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_join_form_id_foreign" FOREIGN KEY ("joinFormId") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval" ADD CONSTRAINT "event_approval_event_approval_step_id_foreign" FOREIGN KEY ("eventApprovalStepId") REFERENCES "event_approval_step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval" ADD CONSTRAINT "event_approval_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval" ADD CONSTRAINT "event_approval_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval" ADD CONSTRAINT "event_approval_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval_step" ADD CONSTRAINT "event_approval_step_previous_step_id_foreign" FOREIGN KEY ("previousStepId") REFERENCES "event_approval_step"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval_step" ADD CONSTRAINT "event_approval_step_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval_step" ADD CONSTRAINT "event_approval_step_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval_validator" ADD CONSTRAINT "event_approval_validator_step_id_foreign" FOREIGN KEY ("stepId") REFERENCES "event_approval_step"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval_validator" ADD CONSTRAINT "event_approval_validator_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval_validator" ADD CONSTRAINT "event_approval_validator_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_approval_validator" ADD CONSTRAINT "event_approval_validator_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_favorite" ADD CONSTRAINT "event_favorite_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_favorite" ADD CONSTRAINT "event_favorite_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_favorite" ADD CONSTRAINT "event_favorite_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_form_submission_id_foreign" FOREIGN KEY ("joinFormSubmissionId") REFERENCES "form_submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_joined_by_id_foreign" FOREIGN KEY ("joinedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_participation_processed_by_id_foreign" FOREIGN KEY ("participationProcessedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_processed_by_id_foreign" FOREIGN KEY ("processedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_qr_code_id_foreign" FOREIGN KEY ("qrCodeId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_join" ADD CONSTRAINT "event_join_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_organize" ADD CONSTRAINT "event_organize_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_organize" ADD CONSTRAINT "event_organize_project_id_foreign" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_organize" ADD CONSTRAINT "event_organize_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_organize" ADD CONSTRAINT "event_organize_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_organize" ADD CONSTRAINT "event_organize_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_supervisor" ADD CONSTRAINT "event_supervisor_event_organize_id_foreign" FOREIGN KEY ("eventOrganizeId") REFERENCES "event_organize"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_supervisor" ADD CONSTRAINT "event_supervisor_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_supervisor" ADD CONSTRAINT "event_supervisor_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_supervisor" ADD CONSTRAINT "event_supervisor_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_bank_info_id_foreign" FOREIGN KEY ("bankInfoId") REFERENCES "bank_info"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_expense_report_id_foreign" FOREIGN KEY ("expenseReportId") REFERENCES "file_upload"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_processed_by_id_foreign" FOREIGN KEY ("processedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_item" ADD CONSTRAINT "expense_item_company_id_foreign" FOREIGN KEY ("companyId") REFERENCES "legal_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_item" ADD CONSTRAINT "expense_item_expense_id_foreign" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_item" ADD CONSTRAINT "expense_item_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_item" ADD CONSTRAINT "expense_item_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_expense_item_id_foreign" FOREIGN KEY ("expenseItemId") REFERENCES "expense_item"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_form_submission_id_foreign" FOREIGN KEY ("formSubmissionId") REFERENCES "form_submission"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_grant_attachment_id_foreign" FOREIGN KEY ("grantId") REFERENCES "grant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_grant_allocate_attachment_id_foreign" FOREIGN KEY ("grantAllocateId") REFERENCES "grant_allocate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_location_id_foreign" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_transaction_attachment_id_foreign" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_followed_actor_id_foreign" FOREIGN KEY ("followedActorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form" ADD CONSTRAINT "form_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form" ADD CONSTRAINT "form_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_form_id_foreign" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant" ADD CONSTRAINT "grant_generated_document_id_foreign" FOREIGN KEY ("generatedDocumentId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant" ADD CONSTRAINT "grant_received_amount_processed_by_id_foreign" FOREIGN KEY ("receivedAmountProcessedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant" ADD CONSTRAINT "grant_signature_id_foreign" FOREIGN KEY ("signatureId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant" ADD CONSTRAINT "grant_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant" ADD CONSTRAINT "grant_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant" ADD CONSTRAINT "grant_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_allocate" ADD CONSTRAINT "grant_allocate_generated_document_id_foreign" FOREIGN KEY ("generatedDocumentId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_allocate" ADD CONSTRAINT "grant_allocate_signature_id_foreign" FOREIGN KEY ("signatureId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_allocate" ADD CONSTRAINT "grant_allocate_grant_id_foreign" FOREIGN KEY ("grantId") REFERENCES "grant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_allocate" ADD CONSTRAINT "grant_allocate_received_amount_processed_by_id_foreign" FOREIGN KEY ("receivedAmountProcessedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_allocate" ADD CONSTRAINT "grant_allocate_transaction_id_foreign" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_allocate" ADD CONSTRAINT "grant_allocate_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grant_allocate" ADD CONSTRAINT "grant_allocate_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_unit" ADD CONSTRAINT "legal_unit_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_unit" ADD CONSTRAINT "legal_unit_parent_id_foreign" FOREIGN KEY ("parentId") REFERENCES "legal_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_unit" ADD CONSTRAINT "legal_unit_location_location_id_foreign" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_geoapify_id_foreign" FOREIGN KEY ("geoapifyId") REFERENCES "address"("geoapifyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_tenant_id_foreign" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_transaction_id_foreign" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log" ADD CONSTRAINT "log_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_event_organize_id_foreign" FOREIGN KEY ("eventOrganizeId") REFERENCES "event_organize"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_project_id_foreign" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_joined_by_id_foreign" FOREIGN KEY ("joinedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_mission_id_foreign" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_points_processed_by_id_foreign" FOREIGN KEY ("pointsProcessedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_processed_by_id_foreign" FOREIGN KEY ("processedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_project_id_foreign" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_eventJoinId_fkey" FOREIGN KEY ("eventJoinId") REFERENCES "event_join"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_join" ADD CONSTRAINT "mission_join_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_banner_id_foreign" FOREIGN KEY ("bannerId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_grant_id_foreign" FOREIGN KEY ("grantId") REFERENCES "grant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_supervisor" ADD CONSTRAINT "project_supervisor_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_supervisor" ADD CONSTRAINT "project_supervisor_project_id_foreign" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_supervisor" ADD CONSTRAINT "project_supervisor_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_supervisor" ADD CONSTRAINT "project_supervisor_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "required_document" ADD CONSTRAINT "required_document_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "required_document" ADD CONSTRAINT "required_document_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "required_role" ADD CONSTRAINT "required_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "required_role" ADD CONSTRAINT "required_role_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social" ADD CONSTRAINT "social_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social" ADD CONSTRAINT "social_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_owner_actor_id_foreign" FOREIGN KEY ("ownerActorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_icon_id_foreign" FOREIGN KEY ("iconId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_join_form_id_foreign" FOREIGN KEY ("joinFormId") REFERENCES "form"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_parent_id_foreign" FOREIGN KEY ("parentId") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_video_id_foreign" FOREIGN KEY ("videoId") REFERENCES "file_upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_tenant_grant_fund_id_foreign" FOREIGN KEY ("tenantGrantFundId") REFERENCES "legal_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_document" ADD CONSTRAINT "team_document_file_id_foreign" FOREIGN KEY ("fileUploadId") REFERENCES "file_upload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_document" ADD CONSTRAINT "team_document_required_document_id_foreign" FOREIGN KEY ("requiredDocumentId") REFERENCES "required_document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_document" ADD CONSTRAINT "team_document_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_document" ADD CONSTRAINT "team_document_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_document" ADD CONSTRAINT "team_document_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_history" ADD CONSTRAINT "team_history_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_history" ADD CONSTRAINT "team_history_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_history" ADD CONSTRAINT "team_history_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_join" ADD CONSTRAINT "team_join_form_submission_id_foreign" FOREIGN KEY ("joinFormSubmissionId") REFERENCES "form_submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_join" ADD CONSTRAINT "team_join_processed_by_id_foreign" FOREIGN KEY ("processedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_join" ADD CONSTRAINT "team_join_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_join" ADD CONSTRAINT "team_join_joined_by_id_foreign" FOREIGN KEY ("joinedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_join" ADD CONSTRAINT "team_join_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_join" ADD CONSTRAINT "team_join_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member_role" ADD CONSTRAINT "team_member_role_team_member_id_foreign" FOREIGN KEY ("teamMemberId") REFERENCES "team_member"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member_role" ADD CONSTRAINT "team_member_role_team_role_id_foreign" FOREIGN KEY ("teamRoleId") REFERENCES "team_role"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_member_role" ADD CONSTRAINT "team_member_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_required_role" ADD CONSTRAINT "team_required_role_team_member_id_foreign" FOREIGN KEY ("teamMemberId") REFERENCES "team_member"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_required_role" ADD CONSTRAINT "team_required_role_required_role_id_foreign" FOREIGN KEY ("requiredRoleId") REFERENCES "required_role"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_required_role" ADD CONSTRAINT "team_required_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_required_role" ADD CONSTRAINT "team_required_role_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_role" ADD CONSTRAINT "team_role_manager_id_foreign" FOREIGN KEY ("managerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_role" ADD CONSTRAINT "team_role_team_id_foreign" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_role" ADD CONSTRAINT "team_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_role" ADD CONSTRAINT "team_role_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant" ADD CONSTRAINT "tenant_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant" ADD CONSTRAINT "tenant_event_validation_form_id_foreign" FOREIGN KEY ("eventValidationFormId") REFERENCES "form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member" ADD CONSTRAINT "tenant_member_user_id_foreign" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member" ADD CONSTRAINT "tenant_member_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member" ADD CONSTRAINT "tenant_member_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member_role" ADD CONSTRAINT "tenant_member_role_tenant_member_id_foreign" FOREIGN KEY ("tenantMemberId") REFERENCES "tenant_member"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member_role" ADD CONSTRAINT "tenant_member_role_tenant_role_id_foreign" FOREIGN KEY ("tenantRoleId") REFERENCES "tenant_role"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_member_role" ADD CONSTRAINT "tenant_member_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_role" ADD CONSTRAINT "tenant_role_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_role" ADD CONSTRAINT "tenant_role_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_tag" ADD CONSTRAINT "transaction_tag_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_tag" ADD CONSTRAINT "transaction_tag_tag_id_foreign" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_tag" ADD CONSTRAINT "transaction_tag_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_bank_account_id_foreign" FOREIGN KEY ("bankAccountId") REFERENCES "bank_account"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_event_id_foreign" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_expense_id_foreign" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_location_id_foreign" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_project_id_foreign" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_payed_by_id_foreign" FOREIGN KEY ("payedById") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_received_by_id_foreign" FOREIGN KEY ("receivedById") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_processed_by_id_foreign" FOREIGN KEY ("processedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_tenant_scope_id_foreign" FOREIGN KEY ("tenantScopeId") REFERENCES "tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_actor_id_foreign" FOREIGN KEY ("actorId") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_created_by_id_foreign" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_tenant_scope_id_foreign" FOREIGN KEY ("originalTenantScopeId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION get_current_user(hasura_session JSON) RETURNS "user" AS $$
DECLARE
  me "user";
BEGIN
  SELECT * INTO me FROM "user" WHERE "user"."id" = (hasura_session ->> 'x-hasura-user-id')::BigInt LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User is not authenticated' USING ERRCODE = 'invalid_authorization_specification';
  END IF;

  RETURN me;
END;
$$ LANGUAGE PLPGSQL STABLE;