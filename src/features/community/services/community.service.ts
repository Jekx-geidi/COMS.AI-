import type { CommunityCluster } from "@/types/community";

// TODO(Stage 13): replace with `active_community_clusters` view
// (Core Docs/DATABASE-STRUCTURE.md #20 / #18 clustering by proximity/time/type/count).
export async function getCommunityClusters(): Promise<CommunityCluster[]> {
  const now = new Date();
  return [
    {
      id: "cluster-1",
      clusterType: "POWER_OUT",
      reportCount: 12,
      firstReportedAt: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
      lastReportedAt: new Date(now.getTime() - 4 * 60 * 1000).toISOString(),
      status: "ACTIVE",
      locationLabel: "Near Banilad",
    },
    {
      id: "cluster-2",
      clusterType: "FLICKERING",
      reportCount: 5,
      firstReportedAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
      lastReportedAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      status: "ACTIVE",
      locationLabel: "Near Guadalupe",
    },
  ];
}
