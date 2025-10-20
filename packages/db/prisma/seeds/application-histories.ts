import { getPrisma } from "../../src";

/**
 * ApplicationHistoriesテーブルのシードデータを投入する
 * 各申請のステータス変更履歴（監査ログ）
 */
export async function seedApplicationHistories() {
  const prisma = getPrisma();

  const histories = [
    // Application 1: PENDING → APPROVED
    {
      applicationId: "60000000-0000-0000-0000-000000000001",
      changedByUserId: null,
      status: "PENDING" as const,
      comment: "申請が作成されました",
      changeDate: new Date("2025-10-15T09:00:00Z"),
    },
    {
      applicationId: "60000000-0000-0000-0000-000000000001",
      changedByUserId: "30000000-0000-0000-0000-000000000004",
      status: "APPROVED" as const,
      comment: "承認しました。有給休暇の取得を許可します。",
      changeDate: new Date("2025-10-15T14:00:00Z"),
    },

    // Application 2: PENDING → REJECTED
    {
      applicationId: "60000000-0000-0000-0000-000000000002",
      changedByUserId: null,
      status: "PENDING" as const,
      comment: "申請が作成されました",
      changeDate: new Date("2025-10-16T10:30:00Z"),
    },
    {
      applicationId: "60000000-0000-0000-0000-000000000002",
      changedByUserId: "30000000-0000-0000-0000-000000000004",
      status: "REJECTED" as const,
      comment: "領収書が不足しています。再申請してください。",
      changeDate: new Date("2025-10-16T16:00:00Z"),
    },

    // Application 3: PENDING → APPROVED
    {
      applicationId: "60000000-0000-0000-0000-000000000003",
      changedByUserId: null,
      status: "PENDING" as const,
      comment: "申請が作成されました",
      changeDate: new Date("2025-10-17T11:00:00Z"),
    },
    {
      applicationId: "60000000-0000-0000-0000-000000000003",
      changedByUserId: "30000000-0000-0000-0000-000000000001",
      status: "APPROVED" as const,
      comment: "アクセス権限を付与しました。",
      changeDate: new Date("2025-10-17T15:30:00Z"),
    },

    // Application 4: PENDING (承認待ち)
    {
      applicationId: "60000000-0000-0000-0000-000000000004",
      changedByUserId: null,
      status: "PENDING" as const,
      comment: "申請が作成されました",
      changeDate: new Date("2025-10-17T14:00:00Z"),
    },

    // Application 5: PENDING → CANCELED
    {
      applicationId: "60000000-0000-0000-0000-000000000005",
      changedByUserId: null,
      status: "PENDING" as const,
      comment: "申請が作成されました",
      changeDate: new Date("2025-10-18T09:30:00Z"),
    },
    {
      applicationId: "60000000-0000-0000-0000-000000000005",
      changedByUserId: "30000000-0000-0000-0000-000000000005",
      status: "CANCELED" as const,
      comment: "予定が変更になったためキャンセルします",
      changeDate: new Date("2025-10-18T17:00:00Z"),
    },

    // Application 6: PENDING (承認待ち)
    {
      applicationId: "60000000-0000-0000-0000-000000000006",
      changedByUserId: null,
      status: "PENDING" as const,
      comment: "申請が作成されました",
      changeDate: new Date("2025-10-18T13:00:00Z"),
    },

    // Application 7: PENDING (承認待ち)
    {
      applicationId: "60000000-0000-0000-0000-000000000007",
      changedByUserId: null,
      status: "PENDING" as const,
      comment: "申請が作成されました",
      changeDate: new Date("2025-10-19T10:00:00Z"),
    },

    // Application 8: PENDING → APPROVED
    {
      applicationId: "60000000-0000-0000-0000-000000000008",
      changedByUserId: null,
      status: "PENDING" as const,
      comment: "申請が作成されました",
      changeDate: new Date("2025-10-19T11:30:00Z"),
    },
    {
      applicationId: "60000000-0000-0000-0000-000000000008",
      changedByUserId: "30000000-0000-0000-0000-000000000004",
      status: "APPROVED" as const,
      comment: "半日休暇を承認しました",
      changeDate: new Date("2025-10-19T14:00:00Z"),
    },

    // Application 9: PENDING (承認待ち)
    {
      applicationId: "60000000-0000-0000-0000-000000000009",
      changedByUserId: null,
      status: "PENDING" as const,
      comment: "申請が作成されました",
      changeDate: new Date("2025-10-19T15:00:00Z"),
    },

    // Application 10: PENDING (承認待ち)
    {
      applicationId: "60000000-0000-0000-0000-000000000010",
      changedByUserId: null,
      status: "PENDING" as const,
      comment: "申請が作成されました",
      changeDate: new Date("2025-10-20T09:00:00Z"),
    },
  ];

  console.log("🌱 Seeding application histories...");

  for (const history of histories) {
    await prisma.applicationHistory.create({
      data: history,
    });
  }

  console.log(
    `✅ Successfully seeded ${histories.length} application histories`,
  );
}
