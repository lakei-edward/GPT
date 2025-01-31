import * as React from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { AiFillGift } from "react-icons/ai";
import { usePremium, useUserInfo } from "@/hooks";
import { Button } from "@/components/ui";

const PremiumBtn: React.FC = () => {
  const session = useSession();
  const tCommon = useTranslations("common");

  const [, setOpen] = usePremium();
  const [userInfo] = useUserInfo();
  const { license_type } = userInfo;

  const onCheck = () => setOpen(true);

  if (
    session.status === "loading" ||
    license_type === "premium" ||
    license_type === "team" ||
    license_type === "none"
  )
    return null;

  return (
    <Button
      type="outline"
      className="flex items-center gap-2 mt-4 mb-2"
      size="base"
      onClick={onCheck}
    >
      <AiFillGift size={28} className="text-orange-400" />
      <span>{tCommon("premium")}</span>
    </Button>
  );
};

export default PremiumBtn;
