import { embedToken } from "@/lib/embed/embed-token";
import { prisma } from "@dub/prisma";
import { notFound } from "next/navigation";

export const getEmbedData = async (token: string) => {
  const linkId = await embedToken.get(token);

  if (!linkId) {
    notFound();
  }

  const referralLink = await prisma.link.findUnique({
    where: {
      id: linkId,
    },
    include: {
      program: true,
      programEnrollment: {
        select: {
          partner: {
            select: {
              users: true,
            },
          },
        },
      },
    },
  });

  if (!referralLink) {
    notFound();
  }

  const { program, programEnrollment, ...link } = referralLink;

  if (!program) {
    notFound();
  }

  return {
    program,
    // check if the user has an active profile on Dub Partners
    hasPartnerProfile:
      programEnrollment && programEnrollment.partner.users.length > 0
        ? true
        : false,
    link,
    earnings:
      (program.commissionType === "percentage" ? link.saleAmount : link.sales) *
      (program.commissionAmount / 100),
  };
};
