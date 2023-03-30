import React from "react";
import { NextPage } from "next";
import LoginContent from "@/components/login/LoginContent";
import Layout from "@/components/app/layouts/Layout";

const Login: NextPage = () => {
  return (
    <Layout
      className="flex items-center justify-center h-screen bg-dark-purple"
      title="Connexion"
    >
      <LoginContent />
    </Layout>
  );
};

export default Login;