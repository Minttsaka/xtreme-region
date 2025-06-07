import { Prisma } from "@prisma/client"

export type SessionPayload = {
  userId     :  string
  expiresAt   :   Date
}

export type SelectedResource = Prisma.ResourceGetPayload<{
    include:{
      authors:true,
    }
}>

export type NewLesson = {
  price: number | null | undefined;
  resources: Set<SelectedResource>;
  status: "COMPLETED"| "IN_PROGRESS"| "NOT_STARTED";
  description: string;
  title: string;
  isPaid: boolean;
  accessLevel: "PUBLIC" | "REGISTERED_USERS" | "ENROLLED_ONLY";
  allowComments: boolean;
  downloadableResources: boolean;
  duration?: number | null;
}