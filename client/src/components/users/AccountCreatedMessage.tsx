import React, { useState } from "react";
import { useTranslation } from "../common/useTranslation";
import LnkBtn from "../common/LnkBtn";
import { usePush } from "../../api/apiRequest";
import { pushResendConfirmation } from "../../state/currentUserSlice";
import { useDispatch } from "react-redux";
import bannerSlice from "../../banners/bannerSlice";

interface IProps {
  email: string;
}

export default function AccountCreatedMessage(props: IProps) {
  const t = useTranslation();
  const dispatch = useDispatch();

  const [didntGet, setDidntGet] = useState(false);

  const [sendResendRequest] = usePush(pushResendConfirmation);
  const sendEmailAgain = async () => {
    const success = await sendResendRequest(props.email);
    if (success) {
      setDidntGet(false);
      dispatch(
        bannerSlice.actions.add({ type: "Success", message: t("Email_sent") })
      );
    }
  };

  return (
    <div>
      <h2>{t("Account_confirmation")}</h2>
      <p>{t("Confirmation_link_email", { email: props.email })}</p>
      <LnkBtn
        text={t("Didnt_get_email")}
        onClick={() => setDidntGet(!didntGet)}
      />
      {didntGet && (
        <div>
          <p>{t("Didnt_get_confirm_email_message", { email: props.email })}</p>
          <button onClick={sendEmailAgain}>{t("Send_email_again")}</button>
        </div>
      )}
    </div>
  );
}
