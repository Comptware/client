import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    useDisclosure
} from "@nextui-org/react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { useAppSelector } from "@/store/hooks";
// import { useRouter } from "next/navigation";

export const UserDropdown = () => {
   const { user, token } = useAppSelector((s) => s.auth);
  // const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // const handleLogout = useCallback(async () => {
  //   // await deleteAuthCookie();
  //   router.replace("/auth/logout");
  // }, [router]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light" radius="full" className="p-0">
          <Avatar
            color='secondary'
            size='md'
            src='https://i.pravatar.cc/150?u=a042581f4e29026704d'
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='User menu actions'
        onAction={(actionKey) => console.log({ actionKey })}>
        <DropdownItem
          key='profile'
          className='flex flex-col justify-start w-full items-start'>
          <p>Signed in as</p>
          <p>{user?.firstName} {user?.lastName}</p>
        </DropdownItem>
        <DropdownItem key='my_profile'>
          <a href="/dashboard/profile" >
            My Profile
          </a>
        </DropdownItem>
        {/* <DropdownItem key='analytics'>Analytics</DropdownItem>
        <DropdownItem key='system'>System</DropdownItem>
        <DropdownItem key='configurations'>Configurations</DropdownItem>
        <DropdownItem key='help_and_feedback'>Help & Feedback</DropdownItem> */}
        <DropdownItem
          key='logout'
          color='danger'
          className='text-danger'
          >
        <a href="/auth/logout" >
        Log Out
      </a>
        </DropdownItem>
        <DropdownItem key='switch'>
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
