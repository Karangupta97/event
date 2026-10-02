"use client";

import { OrgGate } from "@/components/ui/OrgGate";
import { PageContainer } from "@/components/ui/PageContainer";
import { useOrgData } from "@/store/useOrgData";
import { BroadcastComposer } from "@/features/comms/components/BroadcastComposer";
import { BroadcastHistory } from "@/features/comms/components/BroadcastHistory";

export default function BroadcastPage() {
  return (
    <OrgGate>
      <BroadcastContent />
    </OrgGate>
  );
}

function BroadcastContent() {
  const { zones, broadcasts } = useOrgData();

  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <BroadcastComposer zones={zones} />
        <BroadcastHistory broadcasts={broadcasts} zones={zones} />
      </div>
    </PageContainer>
  );
}
