import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { buildLegacyRequest } from "@lib/buildLegacyCtx";
import { ShellMainAppDir } from "app/(use-page-wrapper)/(main-nav)/ShellMainAppDir";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import ProductInquiryView from "~/product-inquiry/views/product-inquiry-view";

const HEADING = "Product Inquiry";
const SUBTITLE = "Multi-source product data lookup for User type";

const Page = async (): Promise<React.JSX.Element> => {
  const _headers = await headers();
  const _cookies = await cookies();

  const session = await getServerSession({ req: buildLegacyRequest(_headers, _cookies) });
  if (!session?.user?.id) {
    return redirect("/auth/login");
  }

  return (
    <ShellMainAppDir heading={HEADING} subtitle={SUBTITLE}>
      <ProductInquiryView />
    </ShellMainAppDir>
  );
};

export default Page;
