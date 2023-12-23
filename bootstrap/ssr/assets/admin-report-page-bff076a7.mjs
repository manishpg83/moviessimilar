import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { u as useAdminReport, R as ReportDateSelector, A as AdminHeaderReport, V as VisitorsReportCharts } from "./admin-routes-d52fddd6.mjs";
import { j as StaticPageTitle, T as Trans } from "../server-entry.mjs";
import { D as DateRangePresets } from "./user-profile-link-f8ce1543.mjs";
import "react-router-dom";
import "clsx";
import "framer-motion";
import "@react-stately/utils";
import "./OpenInNew-3487d289.mjs";
import "@react-aria/utils";
import "@tanstack/react-query";
import "react-hook-form";
import "@internationalized/date";
import "zustand";
import "zustand/middleware";
import "zustand/middleware/immer";
import "deepmerge";
import "react-colorful";
import "@react-stately/color";
import "immer";
import "nanoid";
import "deep-object-diff";
import "dot-object";
import "@react-aria/focus";
import "nano-memoize";
import "@tanstack/react-virtual";
import "./use-resume-subscription-0c40ed0f.mjs";
import "react-dom/server";
import "process";
import "http";
import "axios";
import "react-router-dom/server.mjs";
import "slugify";
import "@internationalized/number";
import "@floating-ui/react-dom";
import "react-merge-refs";
import "react-dom";
import "@react-aria/ssr";
import "axios-retry";
import "tus-js-client";
import "react-use-cookie";
import "mime-match";
import "react-use-clipboard";
import "fscreen";
import "zustand/traditional";
import "@react-aria/interactions";
function AdminReportPage() {
  const [dateRange, setDateRange] = useState(() => {
    return DateRangePresets[2].getRangeValue();
  });
  const { isLoading, data } = useAdminReport({ dateRange });
  const title = /* @__PURE__ */ jsx(Trans, { message: "Visitors report" });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-full gap-12 md:gap-24 p-12 md:p-24 overflow-x-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "md:flex items-center justify-between gap-24 mb-24", children: [
      /* @__PURE__ */ jsx(StaticPageTitle, { children: title }),
      /* @__PURE__ */ jsx("h1", { className: "mb-24 md:mb-0 text-3xl font-light", children: title }),
      /* @__PURE__ */ jsx(ReportDateSelector, { value: dateRange, onChange: setDateRange })
    ] }),
    /* @__PURE__ */ jsx(AdminHeaderReport, { report: data == null ? void 0 : data.headerReport, dateRange }),
    /* @__PURE__ */ jsx(
      VisitorsReportCharts,
      {
        report: data == null ? void 0 : data.visitorsReport,
        isLoading
      }
    )
  ] });
}
export {
  AdminReportPage as default
};
//# sourceMappingURL=admin-report-page-bff076a7.mjs.map
