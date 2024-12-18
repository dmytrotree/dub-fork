"use client";

import { PartnerSaleResponse } from "@/lib/types";
import { Link, Program } from "@dub/prisma/client";
import {
  AnimatedSizeContainer,
  Button,
  buttonVariants,
  ToggleGroup,
  useCopyToClipboard,
  Wordmark,
} from "@dub/ui";
import {
  Check2,
  Copy,
  EnvelopeArrowRight,
  GiftFill,
  LinkedIn,
  QRCode,
  Twitter,
} from "@dub/ui/icons";
import { cn, fetcher, getPrettyUrl } from "@dub/utils";
import { motion } from "framer-motion";
import { CSSProperties, useState } from "react";
import useSWR from "swr";
import { Activity } from "../activity";
import { SalesList } from "../sales-list";
import { LinkToken } from "../token";
import { useIframeVisibility } from "../use-iframe-visibility";

type Tab = "invite" | "rewards";

const heroAnimationDuration = 0.2;

export function EmbedWidgetPageClient({
  program,
  link,
  earnings,
  hasPartnerProfile,
}: {
  program: Program;
  link: Link;
  earnings: number;
  hasPartnerProfile: boolean;
}) {
  const [copied, copyToClipboard] = useCopyToClipboard();
  const [selectedTab, setSelectedTab] = useState<Tab>("invite");

  const isIframeVisible = useIframeVisibility();

  const { data: sales, isLoading } = useSWR<PartnerSaleResponse[]>(
    isIframeVisible && "/api/embed/sales",
    fetcher,
    {
      keepPreviousData: true,
    },
  );

  return (
    <div
      className="flex min-h-screen flex-col"
      style={
        { "--accent-color": program.brandColor || "#171717" } as CSSProperties
      }
    >
      <div
        className={cn(
          "flex flex-col rounded-lg rounded-b-none bg-[var(--accent-color,black)]",
        )}
      >
        <AnimatedSizeContainer
          height
          transition={{ type: "easeInOut", duration: heroAnimationDuration }}
          className="flex flex-col justify-end"
        >
          <div className="flex h-full flex-col justify-end px-5 pt-5">
            <div
              className={cn(
                "mb-4 transition-opacity duration-200",
                selectedTab === "rewards" && "-mt-[3.75rem] opacity-0",
              )}
            >
              <div className="flex size-11 items-center justify-center rounded-full bg-white/20">
                <GiftFill className="size-5 shrink-0 text-white" />
              </div>
            </div>
            <h2 className="flex items-center text-base font-semibold text-white">
              <div
                className={cn(
                  "transition-[margin-left,opacity] duration-200",
                  selectedTab === "invite" && "-ml-10 opacity-0",
                )}
              >
                <div className="mr-2 flex size-8 items-center justify-center rounded-full bg-white/20">
                  <GiftFill className="size-4 shrink-0 text-white" />
                </div>
              </div>
              Refer a friend and earn
            </h2>
          </div>
        </AnimatedSizeContainer>
        <AnimatedSizeContainer
          height
          transition={{ type: "easeInOut", duration: heroAnimationDuration }}
        >
          <div
            className={cn(
              "px-5 pb-5 opacity-100 transition-opacity duration-200",
              selectedTab === "rewards" && "h-0 opacity-0",
            )}
          >
            <p className="pt-2 text-sm text-white/80">
              Earn additional credits and cash when you refer a friend and they
              sign up for {program?.name}
            </p>
          </div>
        </AnimatedSizeContainer>
      </div>

      <div className="p-5">
        <ToggleGroup
          options={[
            { value: "invite", label: "Invite" },
            {
              value: "rewards",
              label: "Rewards",
              badge:
                link.sales > 0 ? (
                  <div className="rounded bg-[var(--accent-color)] px-1.5 py-0.5 text-xs text-white">
                    {link.sales}
                  </div>
                ) : undefined,
            },
          ]}
          selected={selectedTab}
          selectAction={(option: Tab) => setSelectedTab(option)}
          className="grid grid-cols-2 border-transparent bg-neutral-100"
          optionClassName="w-full h-8 flex items-center justify-center font-medium"
          indicatorClassName="rounded-lg bg-white border border-neutral-100 shadow-sm"
        />

        <div className="mt-5">
          {selectedTab === "invite" && (
            <>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-neutral-500">Invite link</span>
                <input
                  type="text"
                  readOnly
                  value={getPrettyUrl(link.shortLink)}
                  className="h-10 w-full rounded-md border border-neutral-300 px-3 text-center text-sm text-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-neutral-500"
                />

                <Button
                  icon={
                    copied ? (
                      <Check2 className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )
                  }
                  text={copied ? "Copied link" : "Copy link"}
                  onClick={() => copyToClipboard(getPrettyUrl(link.shortLink))}
                  className="enabled:border-[var(--accent-color)] enabled:bg-[var(--accent-color)] enabled:hover:bg-[var(--accent-color)]"
                />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {/* TODO: Add social sharing messages */}
                {[
                  {
                    title: "X",
                    icon: Twitter,
                    href: `https://x.com/intent/tweet?text=${encodeURIComponent(link.shortLink)}`,
                  },
                  {
                    title: "LinkedIn",
                    icon: LinkedIn,
                    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link.shortLink)}`,
                  },
                  {
                    title: "Email",
                    icon: EnvelopeArrowRight,
                    href: `mailto:?subject=Check out this link&body=${encodeURIComponent(link.shortLink)}`,
                  },
                  {
                    title: "QR Code",
                    icon: QRCode,
                    href: `https://api.dub.co/qr?url=${link.shortLink}?qr=1`,
                  },
                ].map(({ title, href, icon: Icon }) => {
                  return (
                    <a
                      key={href}
                      href={href}
                      title={title}
                      target="_blank"
                      className="flex h-8 items-center justify-center rounded-md border border-neutral-300 text-neutral-800 transition-colors duration-75 hover:bg-neutral-50 active:bg-neutral-100"
                    >
                      <Icon className="size-4 text-neutral-800" />
                    </a>
                  );
                })}
              </div>
            </>
          )}

          {selectedTab === "rewards" && (
            <>
              <h2 className="text-sm font-semibold text-neutral-900">
                Activity
              </h2>
              <motion.div
                initial={{ height: 150, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{
                  duration: heroAnimationDuration + 0.05,
                  ease: "easeInOut",
                }}
                className="overflow-clip"
              >
                <Activity
                  clicks={link.clicks}
                  leads={link.leads}
                  earnings={earnings}
                />
                <div className="mt-4">
                  <h2 className="text-sm font-semibold text-neutral-900">
                    Recent sales
                  </h2>
                  <SalesList
                    sales={sales}
                    isLoading={isLoading}
                    hasPartnerProfile={hasPartnerProfile}
                  />
                  {!isLoading &&
                    sales &&
                    sales.length > 0 &&
                    (hasPartnerProfile ? (
                      <a
                        href="https://partners.dub.co/settings/payouts"
                        target="_blank"
                        className={cn(
                          buttonVariants({ variant: "primary" }),
                          "mt-3 flex h-10 items-center justify-center whitespace-nowrap rounded-lg border px-4 text-sm",
                        )}
                      >
                        Withdraw earnings
                      </a>
                    ) : (
                      <a
                        href="https://partners.dub.co/register"
                        target="_blank"
                        className={cn(
                          buttonVariants({ variant: "primary" }),
                          "mt-3 flex h-10 items-center justify-center whitespace-nowrap rounded-lg border px-4 text-sm",
                        )}
                      >
                        Create partner account
                      </a>
                    ))}
                </div>
              </motion.div>
            </>
          )}
          {isIframeVisible && <LinkToken />}
        </div>
      </div>
      <div className="flex grow flex-col justify-end">
        <div className="flex items-center justify-center">
          <a
            href="https://d.to/conversions"
            target="_blank"
            className="flex items-center justify-center gap-1 rounded-lg bg-white p-2 pb-2.5 transition-colors"
          >
            <p className="text-sm text-neutral-500">Powered by</p>
            <Wordmark className="h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
