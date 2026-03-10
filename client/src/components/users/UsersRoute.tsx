import React from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import NewUserVerify from "./NewUserVerify";
import CurrentUserPage from "./CurrentUserPage";
import NewPasswordForm from "./NewPasswordForm";

function NewUsersVerifyRoute() {
  const { code } = useParams< { code: string }>();
  return <NewUserVerify verification={code!} />;
}

function NewPasswordFormRoute() {
  const { resetKey } = useParams<{ resetKey: string }>();
  return <NewPasswordForm resetKey={resetKey!} />;
}

export default function UsersRoute() {
  return (
    <Routes>
      <Route path="verify/:code" element={<NewUsersVerifyRoute />} />
      <Route path="passwordReset/:resetKey" element={<NewPasswordFormRoute />} />
      <Route path="me" element={<CurrentUserPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}