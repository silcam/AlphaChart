import React from "react";
import { useLoad } from "../../api/apiRequest";
import { loadGroups } from "./groupSlice";
import { Routes, Route, useParams } from "react-router";
import GroupsIndex from "./GroupsIndex";
import NewGroupPage from "./NewGroupPage";

function GroupsIndexRoute() {
  let { id } = useParams<{ id: string }>();
  return <GroupsIndex id={id} />;
}
export default function GroupsRoute() {
  useLoad(loadGroups());

  return (
    <Routes>
      <Route path="new" element={<NewGroupPage />} />
      <Route path=":id" element={<GroupsIndexRoute />} />
      <Route path="*" element={<GroupsIndex />} />
    </Routes>
  );
}
