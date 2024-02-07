import React from "react";
const primaryColor = "#DD00FF";
const bgColor = "transparent";
const starIcon =
  "M260.743 29.4189L256 15.1886L251.257 29.4189L198.141 188.766H31H16.2496L27.9596 197.735L161.146 299.75L101.257 479.419L96.1033 494.879L109.04 484.969L256 372.405L402.96 484.969L415.897 494.879L410.743 479.419L350.854 299.75L484.04 197.735L495.75 188.766H481H313.859L260.743 29.4189Z";
const heartIcon =
  "M256 90.9474C216.22 -26.8484 16 -9.3503 16 168.794C16 257.55 77.2 375.651 256 496C434.8 375.651 496 257.55 496 168.794C496 -8.32485 296 -27.5466 256 90.9474Z";
export type FRNZ_type_readonly = "readonly";
export type FRNZ_type_readwrite = "readwrite";
export type FRNZ_svg_Rating = "Rating";
export type FRNZ_svg_Popup = "Popup";
export type FRNZ_svg_Default = "Default";

interface FRNZ_svgProps {
  variant?: FRNZ_svg_Rating | FRNZ_svg_Popup | FRNZ_svg_Default;
  color?: string;
  bgcolor?: string;
  show?: number;
  path?: string;
  size?: number;
  type?: FRNZ_type_readonly | FRNZ_type_readwrite;
}
interface FRNZ_svgDataProps {
  xSize: number;
  fillcolor: string;
  sidecolor: string;
  svgpath: string;
  svgsize: number;
  svgtype: FRNZ_type_readonly | FRNZ_type_readwrite;
}
const FRNZ_svg = ({
  variant,
  color,
  bgcolor,
  show,
  path,
  size,
  type,
}: FRNZ_svgProps) => {
  const svgData: FRNZ_svgDataProps = {
    xSize: show ? (show <= 0 ? 0 : show >= 100 ? 511 : (show * 512) / 100) : 0,
    fillcolor: color ? color : primaryColor,
    sidecolor: bgcolor ? bgcolor : bgColor,
    svgpath: path ? path : variant && variant == "Popup" ? heartIcon : starIcon,
    svgsize: size ? size : 256,
    svgtype: type ? type : "readonly",
  };
  const svg_variant = variant ? variant : "Default";

  switch (svg_variant) {
    case "Rating":
      return <FRNZ_svg_Rating svgData={svgData} />;
    case "Popup":
      return <FRNZ_svg_Popup svgData={svgData} />;

    case "Default":
      return <FRNZ_svg_Rating svgData={svgData} />;

    default:
      <></>;
  }
};

export default FRNZ_svg;

type FRNZ_svg_RatingProps = {
  svgData: FRNZ_svgDataProps;
};

const FRNZ_svg_Rating = ({ svgData }: FRNZ_svg_RatingProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={svgData.svgsize}
      height={svgData.svgsize}
      fill="none"
    >
      <path
        d={svgData.svgpath}
        fill={`url(#starsvg${svgData.xSize}${svgData.fillcolor})`}
        stroke={svgData.fillcolor}
        strokeWidth="10"
      />
      <defs>
        <linearGradient
          id={`starsvg${svgData.xSize}${svgData.fillcolor}`}
          x1={svgData.xSize}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={svgData.fillcolor} />
          <stop stopColor={svgData.sidecolor} />
        </linearGradient>
      </defs>
    </svg>
  );
};

type FRNZ_svg_PopupProps = {
  svgData: FRNZ_svgDataProps;
};

const FRNZ_svg_Popup = ({ svgData }: FRNZ_svg_PopupProps) => {
  const FRNZ_togglePopup = (target: any) => {
    const elem = target as HTMLDivElement;
    const child1 = elem.children[0] as HTMLElement;
    const child2 = elem.children[1] as HTMLElement;

    if (child2.style.opacity == "1") {
      child1.style.stroke = svgData.fillcolor;
      child2.style.opacity = "0";
      child2.style.transform = "scale(0.33)";
      child2.style.transition = " all 0.33s ease";
    } else {
      child1.style.stroke = "transparent";
      child2.style.opacity = "1";
      child2.style.transform = "none";
      child2.style.transition = "all 0.5s cubic-bezier(0.19, 2.41, 0.45, 0.94)";
    }
  };
  return (
    <>
      <svg
        viewBox="0 0 512 512"
        width={svgData.svgsize}
        height={svgData.svgsize}
        onClick={(e) => {
          e.preventDefault();
          FRNZ_togglePopup(e.currentTarget);
        }}
        style={{
          overflow: "visible",
        }}
      >
        <use
          xlinkHref={`#heartsvg${svgData.xSize}${svgData.fillcolor}`}
          style={{
            fill: "transparent",
            stroke: svgData.fillcolor,
            strokeWidth: 10,
            msTransition: " all 0.33s ease",
          }}
        />
        <use
          xlinkHref={`#heartsvg${svgData.xSize}${svgData.fillcolor}`}
          style={{
            fill: svgData.fillcolor,
            stroke: svgData.fillcolor,
            opacity: 0,
            transform: "scale(0.33)",
            transformOrigin: "center",
          }}
        />
      </svg>

      <svg
        viewBox="0 0 512 512"
        width={svgData.svgsize}
        height={svgData.svgsize}
        style={{ display: "none" }}
      >
        <defs>
          <path
            id={`heartsvg${svgData.xSize}${svgData.fillcolor}`}
            d={svgData.svgpath ? svgData.svgpath : heartIcon}
          />
        </defs>
      </svg>
    </>
  );
};
