import { Logo } from "@calcom/ui/components/logo";
import Loader from "@components/Loader";
import classNames from "classnames";

interface Props {
  footerText?: React.ReactNode | string;
  showLogo?: boolean;
  heading?: string;
  loading?: boolean;
}

export default function AuthContainer(props: React.PropsWithChildren<Props>) {
  return (
    <div className="bg-subtle dark:bg-default flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Cricket Field Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Cricket pitch center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[hsla(140,30%,50%,0.2)] to-transparent transform -translate-x-1/2" />
        {/* Boundary circle hint */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] border border-[hsla(140,40%,40%,0.08)] rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] border border-[hsla(140,40%,40%,0.05)] rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {props.showLogo && <Logo small inline={false} className="mx-auto mb-auto relative z-10" />}

      <div
        className={classNames(
          props.showLogo ? "text-center" : "",
          "sm:mx-auto sm:w-full sm:max-w-md relative z-10"
        )}>
        {props.heading && <h2 className="font-cal text-emphasis text-center text-3xl">{props.heading}</h2>}
      </div>
      {props.loading && (
        <div className="bg-cal-muted absolute z-50 flex h-screen w-full items-center">
          <Loader />
        </div>
      )}
      <div className="mb-auto mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-default dark:bg-cal-muted border-subtle mx-2 rounded-xl border px-4 py-10 sm:px-10 shadow-lg shadow-[hsla(140,40%,30%,0.1)] dark:shadow-[hsla(140,40%,20%,0.2)]">
          {props.children}
        </div>
        <div className="text-default mt-8 text-center text-sm">{props.footerText}</div>
      </div>
    </div>
  );
}
