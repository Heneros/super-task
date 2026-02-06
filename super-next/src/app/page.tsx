

import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Header />
      <h1>Super Next.js</h1>
      <Card />
      <Pagination />
      <Footer />
    </>
  );
}
