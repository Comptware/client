//// Will move OPERATIONS from the Client dash later
// src/components/sidebar/sidebar.tsx
import { SettingsModal } from "@/components/settings/settings-modal";
import { useAppSelector } from "@/store/hooks";
import { useDisclosure } from "@nextui-org/react";
import { usePathname } from "next/navigation";

import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { useSidebarContext } from "../layout/layout-context";
import { useUserContext } from "../layout/user-context";
import { CompanyLogo } from "./company-logo";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { Sidebar } from "./sidebar.styles";

import { MiningIcon } from "../icons/sidebar/mining-icon";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  const { user, roles } = useUserContext();
  const { user: reduxUser } = useAppSelector((s) => s.auth);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const finalUser = user || reduxUser;
  const finalRoles = (roles ?? []).length > 0 ? (roles ?? []) : reduxUser?.roles ?? [];
  const safeFinalRoles = finalRoles ?? [];

  const isClientUser = safeFinalRoles.length === 0;

  const hasRole = (role: string) => safeFinalRoles.includes(role);
  const hasAnyRole = (allowed: string[]) => allowed.some((r) => safeFinalRoles.includes(r));

  return (
    <aside
      // className="h-[calc(100vh_-_225px)] z-[9999] sticky top-[225px]"
      className="h-[calc(100vh_-_225px)] sticky top-[225px]"
    >
      {collapsed && (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      )}

      <div
        className={Sidebar({
          collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompanyLogo />
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>

            {/* ================= CLIENT SIDEBAR ================= */}
            {isClientUser && (
              <>
                <SidebarItem
                  title="Home"
                  icon={<HomeIcon />}
                  isActive={pathname === "/dashboard"}
                  href="/dashboard"
                />

                <SidebarMenu title="Orders">
                  <SidebarItem
                    isActive={pathname === "/dashboard/orders"}
                    title="Order Status"
                    icon={<ProductsIcon />}
                    href="/dashboard/orders"
                  />
                   <SidebarItem
                    isActive={pathname === "/dashboard/asic-ror"}
                    title="ASIC ROR"
                    icon={<MiningIcon />}
                    href="/dashboard/asic-ror"
                  />
                </SidebarMenu>

                <SidebarMenu title="Settings">
                  <SidebarItem
                    isActive={pathname === "/dashboard/profile"}
                    title="My Profile"
                    icon={<AccountsIcon />}
                    href="/dashboard/profile"
                  />
                  <SidebarItem
                    isActive={pathname === "/dashboard/wallet"}
                    title="My Wallet"
                    icon={<BalanceIcon />}
                    href="/dashboard/wallet"
                  />
                  <div onClick={onOpen} className="cursor-pointer">
                    <SidebarItem
                      isActive={false}
                      title="Security"
                      icon={<DevIcon />}
                    />
                  </div>
                </SidebarMenu>

                <SidebarMenu title="Documents">
                  <SidebarItem
                    isActive={pathname === "/dashboard/statements"}
                    title="Statements"
                    icon={<PaymentsIcon />}
                    href="/dashboard/statements"
                  />
                  <SidebarItem
                    isActive={pathname === "/dashboard/contracts"}
                    title="Service Contracts"
                    icon={<ReportsIcon />}
                    href="/dashboard/contracts"
                  />
                </SidebarMenu>
              </>
            )}

            {/* ================= NON-ADMIN ================= */}
            {finalUser && !hasRole("ADMIN") && (
              <>
                <SidebarMenu title="Administrator">
                  <SidebarItem
                    isActive={pathname === "/dashboard/accounts"}
                    title="Accounts"
                    icon={<AccountsIcon />}
                    href="/dashboard/accounts"
                  />

                  <SidebarItem
                    isActive={pathname === "/dashboard/reports"}
                    title="Reports"
                    icon={<ReportsIcon />}
                  />
                </SidebarMenu>
              </>
            )}

            {/* ================= ADMIN / OPERATIONS ================= */}
            {finalUser && hasAnyRole(["ADMIN", "OPERATIONS"]) && (
                <>
                  <SidebarItem
                    title="Operations"
                    icon={<DevIcon />}
                    isActive={pathname.startsWith("/ops")}
                    href="/ops"
                  />

                  <SidebarItem
                    title="Commands Center"
                    icon={<DevIcon />}
                    isActive={pathname.startsWith("/ops/commands")}
                    href="/ops/commands"
                  />

                  <SidebarItem
                    title="Sensors"
                    icon={<DevIcon />}
                    isActive={pathname.startsWith("/ops/sensors")}
                    href="/ops/sensors"
                  />

                  <SidebarItem
                    title="Alerts"
                    icon={<DevIcon />}
                    isActive={pathname.startsWith("/ops/alerts")}
                    href="/ops/alerts"
                  />
                </>
              )}
          </div>

          {/* ================= FOOTER (DISABLED) ================= */}
          {/*
          <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit cursor-pointer" onClick={onOpen}>
                <SettingsIcon />
              </div>
            </Tooltip>

            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>

            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip>
          </div>
          */}
        </div>
      </div>

      <SettingsModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </aside>
  );
};