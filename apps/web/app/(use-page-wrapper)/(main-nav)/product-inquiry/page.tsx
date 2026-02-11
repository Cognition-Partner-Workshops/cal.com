import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { _generateMetadata, getTranslate } from "app/_utils";
import { ShellMainAppDir } from "app/(use-page-wrapper)/(main-nav)/ShellMainAppDir";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import ProductInquiryView from "~/product-inquiry/views/product-inquiry-view";

const Page = async (): Promise<React.JSX.Element> => {
  const _headers = await headers();
  const _cookies = await cookies();

  const session = await getServerSession({ req: buildLegacyRequest(_headers, _cookies) });
  if (!session?.user?.id) {
    return redirect("/auth/login");
  }

  const t = await getTranslate();

  return (
    <ShellMainAppDir heading={t("product_inquiry")} subtitle={t("product_inquiry_description")}>
      <ProductInquiryView />
    </ShellMainAppDir>
  );
};

export const generateMetadata = async (): Promise<Metadata> =>
  await _generateMetadata(
    (t) => t("product_inquiry"),
    (t) => t("product_inquiry_description"),
    undefined,
    undefined,
    "/product-inquiry"
  );

export default Page;
