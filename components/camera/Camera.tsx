"use client";
import Image from "next/image";
import React, { useEffect, useCallback, useRef, useState } from "react";

const primaryColor = "white";
const bgColor = "#DD00FF";

interface cameraUtils {
  imgSize: number;
  width: string;
  height: string;
  container: HTMLDivElement | null;
  videoStream: MediaStream | null;
  video: HTMLVideoElement | null;
  canvas: HTMLCanvasElement | null;
  canvasCtx: CanvasRenderingContext2D | null;
  photo: HTMLImageElement | null;
  imgDataURL: string;
  localImglink: HTMLAnchorElement | null;
  snapBtn: HTMLImageElement | null;
  cancelBtn: HTMLImageElement | null;
  uploadBtn: HTMLImageElement | null;
}

const cameraUtils: cameraUtils = {
  imgSize: 1024,
  width: "512px",
  height: "512px",
  container: null,
  videoStream: null,
  video: null,
  canvas: null,
  canvasCtx: null,
  photo: null,
  imgDataURL: "",
  localImglink: null,
  snapBtn: null,
  cancelBtn: null,
  uploadBtn: null,
};

interface camSize extends React.CSSProperties {
  maxWidth?: string;
  width?: string;
  height?: string;
  maxHeight?: string;
}

const camSize: camSize = {
  width: "100%",
  height: "100%",
  maxWidth: "512px",
  maxHeight: "1024px",
};

type CameraProps = {
  color?: string;
  borderColor?: string;
};

const Camera = ({ color, borderColor }: CameraProps) => {
  const camContainer = useRef<HTMLDivElement | null>(null);

  const [camState, setCamState] = useState({
    canvasShow: false,
    photoShow: false,
    snapBtnShow: false,
    cancelBtnShow: false,
    uploadBtnShow: false,
    downloadBtnShow: false,
  });

  const [camRatio, setCamRatio] = useState<number | null>(null);
  const [srcImgData, setSrcImgData] = useState("/next.svg");

  const cameraInit = useCallback(async () => {
    const containerRef = camContainer.current;
    // assigning element from parent ref
    cameraUtils.video = containerRef?.children[0]
      .children[0] as HTMLVideoElement;
    cameraUtils.canvas = containerRef?.children[1]
      .children[0] as HTMLCanvasElement;
    cameraUtils.photo = containerRef?.children[2]
      .children[0] as HTMLImageElement;
    cameraUtils.snapBtn = containerRef?.children[3]
      .children[0] as HTMLImageElement;
    cameraUtils.cancelBtn = containerRef?.children[4]
      .children[0] as HTMLImageElement;
    cameraUtils.uploadBtn = containerRef?.children[5]
      .children[0] as HTMLImageElement;

    if (cameraUtils.canvas) {
      cameraUtils.canvasCtx = cameraUtils.canvas.getContext("2d");
    }
    Responsive();
  }, [camContainer]);

  const Responsive = useCallback(() => {
    const vid = camContainer.current?.children[0].children[0] as HTMLElement;
    if (innerWidth < 512) {
      cameraUtils.width = `${Math.floor(vid.clientWidth)}px`;
      cameraUtils.height = `${Math.floor(vid.clientWidth * (16 / 9))}px`;
    } else {
      cameraUtils.width = "512px";
      cameraUtils.height = "512px";
    }
    if (cameraUtils.video && cameraUtils.canvas && cameraUtils.photo) {
      cameraUtils.video.style.width = cameraUtils.width;
      cameraUtils.video.style.height = cameraUtils.height;
      cameraUtils.photo.style.width = cameraUtils.width;
      cameraUtils.photo.style.height = cameraUtils.height;
      cameraUtils.canvas.style.width = cameraUtils.width;
      cameraUtils.canvas.style.height = cameraUtils.height;
      if (innerWidth < 512) {
        cameraUtils.canvas.width = Math.floor(vid.clientWidth);
        cameraUtils.canvas.height = Math.floor(vid.clientWidth * (16 / 9));
      } else {
        cameraUtils.canvas.width = 512;
        cameraUtils.canvas.height = 512;
      }
    }
  }, []);

  let cameraOpen = useCallback(
    async (cameraRatio: number) => {
      try {
        if (cameraUtils.videoStream == null && navigator.mediaDevices) {
          cameraUtils.videoStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              aspectRatio: cameraRatio,
              // deviceId: undefined,
              facingMode: "user",
            },
          });
          if (cameraUtils.videoStream != null) {
            handlesucess(cameraUtils.videoStream);
          } else {
            console.log("Camera is not running");
          }
        } else {
          alert("Camera already in use!");
        }
      } catch (error) {
        handleError(error);
      }
    },
    [camRatio]
  );

  const handlesucess = useCallback(async (stream: MediaStream) => {
    if (cameraUtils.video != null) {
      cameraUtils.video.srcObject = stream;
    }
  }, []);

  const handleError = useCallback(async (error: any) => {
    console.log(error);
  }, []);

  const cameraStop = useCallback(async () => {
    if (cameraUtils.videoStream != null && cameraUtils.videoStream) {
      cameraUtils.videoStream.getTracks().forEach((track: any) => track.stop());
      cameraUtils.videoStream = null;
    }
    if (cameraUtils.video !== null) {
      cameraUtils.video.srcObject = null;
    }
  }, []);

  const onSnap = useCallback(
    (e: any) => {
      e.preventDefault();
      if (cameraUtils.videoStream) {
        if (cameraUtils.video != undefined && cameraUtils.video !== null) {
          if (cameraUtils.canvasCtx != null && cameraUtils.canvas?.width) {
            cameraUtils.canvasCtx.drawImage(
              cameraUtils.video,
              0,
              0,
              cameraUtils.canvas?.width,
              cameraUtils.canvas?.height
            );
            // cameraUtils.canvasCtx.drawImage(
            //   image,
            //   0,
            //   0,
            // cameraUtils.canvas?.width,
            // cameraUtils.canvas?.height;
            // );
          }
          if (cameraUtils.canvas) {
            cameraUtils.imgDataURL = cameraUtils.canvas.toDataURL("image/png");
            setSrcImgData(cameraUtils.imgDataURL);
          }
          setCamState((prev) => {
            return {
              ...prev,
              photoShow: true,
              cancelBtnShow: true,
              uploadBtnShow: true,
              snapBtnShow: false,
            };
          });
          cameraStop();
          console.log("photo clicked ");
        }
      }
    },
    [cameraStop]
  );

  const onCancel = useCallback(
    (e: any) => {
      e.preventDefault();
      if (cameraUtils.videoStream == null) {
        cameraUtils.videoStream = null;
        if (camRatio != null) {
          cameraOpen(camRatio);
          setCamState((prev) => {
            return {
              ...prev,
              photoShow: false,
              cancelBtnShow: false,
              uploadBtnShow: false,
              snapBtnShow: true,
            };
          });
        }
      }
    },
    [cameraOpen]
  );

  const onUpload = useCallback((e: any) => {
    e.preventDefault();
    console.log("uploaded succesfully");
    setCamState((prev) => {
      return {
        ...prev,
        cancelBtnShow: false,
        uploadBtnShow: false,
        downloadBtnShow: true,
      };
    });
  }, []);

  const onDownload = useCallback((e: any) => {
    e.preventDefault();
    console.log("download succesfully");
    const localImglink = document.createElement("a") as HTMLAnchorElement;
    localImglink.href = cameraUtils.imgDataURL;
    localImglink.download = "image.png";
    localImglink.target = "_blank";
    localImglink.click();
    setCamState((prev) => {
      return {
        ...prev,
        cancelBtnShow: false,
        uploadBtnShow: false,
        downloadBtnShow: false,
      };
    });
  }, []);

  const setCameraRatio = useCallback(async () => {
    setCamRatio(innerWidth < 512 ? 9 / 16 : 1);
    Responsive();
  }, []);

  useEffect(() => {
    setCameraRatio();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setCameraRatio();
    });

    return () => {
      window.removeEventListener("resize", setCameraRatio);
    };
  }, []);

  useEffect(() => {
    if (camRatio != null) {
      cameraInit();
      cameraOpen(camRatio);
      setCamState((prev) => {
        return { ...prev, snapBtnShow: true };
      });
    }
    return () => {
      cameraStop();
    };
  }, [camRatio]);

  return (
    <section>
      <div style={{ position: "relative" }} ref={camContainer}>
        <div
          ref={camContainer}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "528px",
            margin: "auto",
            border: "8px solid",
            borderColor: borderColor ? borderColor : bgColor,
            position: "relative",
          }}
        >
          <video
            width={cameraUtils.imgSize}
            height={cameraUtils.imgSize}
            autoPlay
            muted
            style={{ ...camSize }}
          />
        </div>

        <CamBox
          state={camState.canvasShow}
          children={<canvas style={{ ...camSize }}></canvas>}
        />
        <CamBox
          state={camState.photoShow}
          children={
            <Image
              src={srcImgData}
              width={cameraUtils.imgSize}
              height={cameraUtils.imgSize}
              alt="camera photo"
              style={{ ...camSize }}
            />
          }
        />
        <CamBox
          state={camState.snapBtnShow}
          children={
            <SVG_snap
              color={color}
              borderColor={borderColor}
              onClickFun={onSnap}
            />
          }
        />
        <CamBox
          state={camState.downloadBtnShow}
          children={
            <SVG_download
              color={color}
              borderColor={borderColor}
              onClickFun={onDownload}
            />
          }
        />
        <CamBox
          state={camState.uploadBtnShow}
          children={
            <SVG_upload
              color={color}
              borderColor={borderColor}
              onClickFun={onUpload}
            />
          }
        />
        <CamBox
          state={camState.cancelBtnShow}
          height={"auto"}
          children={
            <SVG_cancel
              color={color}
              borderColor={borderColor}
              onClickFun={onCancel}
            />
          }
        />
      </div>
    </section>
  );
};

export default Camera;

type SVG_snapProps = {
  color?: string;
  borderColor?: string;
  onClickFun?: (e: any) => void;
};
type SVG_uploadProps = {
  color?: string;
  borderColor?: string;
  onClickFun?: (e: any) => void;
};

type SVG_cancelProps = {
  color?: string;
  borderColor?: string;
  onClickFun?: (e: any) => void;
};

type CamBoxProps = {
  width?: string;
  height?: string;
  state?: boolean;
  children?: React.ReactNode;
};

const CamBox = ({ children, state, height, width }: CamBoxProps) => {
  return (
    <div
      style={{
        display: state ? "block" : "none",
        width: width ? width : "100%",
        height: height ? height : "100%",
        maxWidth: "528px",
        border: "8px solid",
        borderColor: "transparent",
        position: "absolute",
        top: "0",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {children}
    </div>
  );
};

const SVG_snap = ({ color, borderColor, onClickFun }: SVG_snapProps) => {
  let svgcolor = color ? color : primaryColor;
  let svgborderColor = borderColor ? borderColor : bgColor;
  if (borderColor == "transparent") {
    svgborderColor = svgcolor;
    svgcolor = "transparent";
  }
  return (
    <div
      style={{
        boxSizing: "border-box",
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        zIndex: "10",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={56}
        height={56}
        style={{
          marginBottom: "16px",
          cursor: "pointer",
          backgroundColor: "transparent",
          zIndex: "100",
        }}
        onClick={
          onClickFun
            ? onClickFun
            : () => {
                console.log("clicked");
              }
        }
      >
        <path
          d="M256 512C397.384 512 512 397.383 512 255.999C512 114.614 397.384 0 256 0C114.615 0 0 114.614 0 255.999C0 397.383 114.615 512 256 512Z"
          fill={svgcolor}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M256 0C114.618 0 0 114.618 0 256C0 397.382 114.618 512 256 512C397.382 512 512 397.382 512 256C512 114.618 397.382 0 256 0ZM264.862 45.1072C386.236 45.1072 484.62 143.492 484.62 264.866C484.62 386.24 386.236 484.624 264.862 484.624C143.488 484.624 45.0731 386.24 45.0731 264.866C45.0731 143.492 143.488 45.1072 264.862 45.1072Z"
          fill="black"
          fillOpacity="0.067"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M256 0C114.61 0 0 114.62 0 256C0 397.39 114.62 512 256 512C397.39 512 512 397.38 512 256C512 114.61 397.38 0 256 0ZM256 27.4564C382.23 27.4564 484.551 129.777 484.551 256.007C484.551 382.238 382.23 484.558 256 484.558C129.77 484.558 27.4178 382.238 27.4178 256.007C27.4178 129.777 129.77 27.4564 256 27.4564Z"
          fill={svgborderColor}
          stroke="black"
          strokeOpacity="0.31"
          strokeWidth="4.904"
        />
        <path
          d="M285.574 152.006C271.51 151.933 257.338 152.602 243.318 152.167H214.284C193.094 156.147 204.709 197.843 177.794 192.659C159.896 193.221 135.86 188.265 127.34 209.181C123.086 229.946 126.12 251.619 125.201 272.812C125.567 297.387 124.465 322.063 125.785 346.58C132.227 364.129 149.424 374.505 161.363 388.306C193.263 420.212 225.176 452.102 257.083 484C369.715 484 463.175 401.969 481 294.426C449.819 263.254 418.638 232.071 387.447 200.899C378.042 189.284 362.446 194.181 350.311 192.022C337.013 179.245 324.686 165.35 310.71 153.344C302.384 152.363 294.005 152.059 285.564 152.016"
          fill="black"
          fillOpacity="0.235"
        />
        <path
          d="M253 227C231.79 227 214.6 243.795 214.6 264.5C214.6 285.212 231.79 302 253 302C274.204 302 291.4 285.212 291.4 264.5C291.4 243.795 274.204 227 253 227ZM355.4 189.5H324.68C320.456 189.5 315.904 186.3 314.571 182.385L306.629 159.113C305.291 155.2 300.744 152 296.52 152H209.48C205.256 152 200.704 155.2 199.371 159.115L191.429 182.387C190.091 186.3 185.544 189.5 181.32 189.5H150.6C136.52 189.5 125 200.75 125 214.5V327C125 340.75 136.52 352 150.6 352H355.4C369.48 352 381 340.75 381 327V214.5C381 200.75 369.48 189.5 355.4 189.5ZM253 327C217.654 327 189 299.018 189 264.5C189 229.985 217.654 202 253 202C288.341 202 317 229.985 317 264.5C317 299.018 288.341 327 253 327ZM346.44 231.975C341.494 231.975 337.48 228.06 337.48 223.225C337.48 218.395 341.494 214.475 346.44 214.475C351.391 214.475 355.4 218.395 355.4 223.225C355.4 228.06 351.388 231.975 346.44 231.975Z"
          fill={svgborderColor}
        />
      </svg>
    </div>
  );
};

const SVG_cancel = ({ color, borderColor, onClickFun }: SVG_cancelProps) => {
  const svgcolor = color ? color : primaryColor;
  const svgborderColor = borderColor ? borderColor : bgColor;
  return (
    <div
      style={{
        boxSizing: "border-box",
        backgroundColor: "transparent",
        width: "100%",
        height: "auto",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-start",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={32}
        height={32}
        style={{
          cursor: "pointer",
          marginRight: "8px",
          marginTop: "8px",
        }}
        onClick={
          onClickFun
            ? onClickFun
            : () => {
                console.log("clicked");
              }
        }
      >
        <path
          d="M256 512C397.384 512 512 397.383 512 255.999C512 114.614 397.384 0 256 0C114.615 0 0 114.614 0 255.999C0 397.383 114.615 512 256 512Z"
          fill={svgborderColor}
        />
        <path
          d="M256 46C139.87 46 46 139.87 46 256C46 372.13 139.87 466 256 466C372.13 466 466 372.13 466 256C466 139.87 372.13 46 256 46ZM346.3 346.3C338.11 354.49 324.88 354.49 316.69 346.3L256 285.61L195.31 346.3C187.12 354.49 173.89 354.49 165.7 346.3C157.51 338.11 157.51 324.88 165.7 316.69L226.39 256L165.7 195.31C157.51 187.12 157.51 173.89 165.7 165.7C173.89 157.51 187.12 157.51 195.31 165.7L256 226.39L316.69 165.7C324.88 157.51 338.11 157.51 346.3 165.7C354.49 173.89 354.49 187.12 346.3 195.31L285.61 256L346.3 316.69C354.28 324.67 354.28 338.11 346.3 346.3Z"
          fill={svgcolor}
        />
      </svg>
    </div>
  );
};

const SVG_upload = ({ color, borderColor, onClickFun }: SVG_uploadProps) => {
  let svgcolor = color ? color : primaryColor;
  let svgborderColor = borderColor ? borderColor : bgColor;
  if (borderColor == "transparent") {
    svgborderColor = svgcolor;
    svgcolor = "transparent";
  }
  return (
    <div
      style={{
        boxSizing: "border-box",
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        zIndex: "10",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={56}
        height={56}
        style={{
          marginBottom: "16px",
          cursor: "pointer",
          backgroundColor: "transparent",
          zIndex: "100",
        }}
        onClick={
          onClickFun
            ? onClickFun
            : () => {
                console.log("clicked");
              }
        }
      >
        <path
          d="M256 512C397.384 512 512 397.383 512 255.999C512 114.614 397.384 0 256 0C114.615 0 0 114.614 0 255.999C0 397.383 114.615 512 256 512Z"
          fill={svgcolor}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M256 0C114.618 0 0 114.618 0 256C0 397.382 114.618 512 256 512C397.382 512 512 397.382 512 256C512 114.618 397.382 0 256 0ZM264.862 45.1072C386.236 45.1072 484.62 143.492 484.62 264.866C484.62 386.24 386.236 484.624 264.862 484.624C143.488 484.624 45.0731 386.24 45.0731 264.866C45.0731 143.492 143.488 45.1072 264.862 45.1072Z"
          fill="black"
          fillOpacity="0.067"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M256 0C114.61 0 0 114.62 0 256C0 397.39 114.62 512 256 512C397.39 512 512 397.38 512 256C512 114.61 397.38 0 256 0ZM256 27.4564C382.23 27.4564 484.551 129.777 484.551 256.007C484.551 382.238 382.23 484.558 256 484.558C129.77 484.558 27.4178 382.238 27.4178 256.007C27.4178 129.777 129.77 27.4564 256 27.4564Z"
          fill={svgborderColor}
          stroke="black"
          strokeOpacity="0.31"
          strokeWidth="4.904"
        />
        <path
          d="M279.016 314.739H231.984C224.165 314.739 217.875 308.448 217.875 300.628V201.847H166.317C155.853 201.847 150.62 189.206 158.028 181.797L247.446 92.3074C251.855 87.8975 259.086 87.8975 263.495 92.3074L352.972 181.797C360.38 189.206 355.147 201.847 344.683 201.847H293.125V300.628C293.125 308.448 286.835 314.739 279.016 314.739ZM406 310.035V375.889C406 383.709 399.71 390 391.891 390H119.109C111.29 390 105 383.709 105 375.889V310.035C105 302.215 111.29 295.924 119.109 295.924H199.062V300.628C199.062 318.796 213.819 333.554 231.984 333.554H279.016C297.181 333.554 311.938 318.796 311.938 300.628V295.924H391.891C399.71 295.924 406 302.215 406 310.035ZM333.102 361.777C333.102 355.309 327.811 350.018 321.344 350.018C314.877 350.018 309.586 355.309 309.586 361.777C309.586 368.245 314.877 373.537 321.344 373.537C327.811 373.537 333.102 368.245 333.102 361.777ZM370.727 361.777C370.727 355.309 365.436 350.018 358.969 350.018C352.502 350.018 347.211 355.309 347.211 361.777C347.211 368.245 352.502 373.537 358.969 373.537C365.436 373.537 370.727 368.245 370.727 361.777Z"
          fill={svgborderColor}
        />
      </svg>
    </div>
  );
};

const SVG_download = ({ color, borderColor, onClickFun }: SVG_uploadProps) => {
  let svgcolor = color ? color : primaryColor;
  let svgborderColor = borderColor ? borderColor : bgColor;
  if (borderColor == "transparent") {
    svgborderColor = svgcolor;
    svgcolor = "transparent";
  }
  return (
    <div
      style={{
        boxSizing: "border-box",
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        zIndex: "10",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={56}
        height={56}
        style={{
          marginBottom: "16px",
          cursor: "pointer",
          backgroundColor: "transparent",
          zIndex: "100",
        }}
        onClick={
          onClickFun
            ? onClickFun
            : () => {
                console.log("clicked");
              }
        }
      >
        <path
          d="M256 512C397.384 512 512 397.383 512 255.999C512 114.614 397.384 0 256 0C114.615 0 0 114.614 0 255.999C0 397.383 114.615 512 256 512Z"
          fill={svgcolor}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M256 0C114.618 0 0 114.618 0 256C0 397.382 114.618 512 256 512C397.382 512 512 397.382 512 256C512 114.618 397.382 0 256 0ZM264.862 45.1072C386.236 45.1072 484.62 143.492 484.62 264.866C484.62 386.24 386.236 484.624 264.862 484.624C143.488 484.624 45.0731 386.24 45.0731 264.866C45.0731 143.492 143.488 45.1072 264.862 45.1072Z"
          fill="black"
          fillOpacity="0.067"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M256 0C114.61 0 0 114.62 0 256C0 397.39 114.62 512 256 512C397.39 512 512 397.38 512 256C512 114.61 397.38 0 256 0ZM256 27.4564C382.23 27.4564 484.551 129.777 484.551 256.007C484.551 382.238 382.23 484.558 256 484.558C129.77 484.558 27.4178 382.238 27.4178 256.007C27.4178 129.777 129.77 27.4564 256 27.4564Z"
          fill={svgborderColor}
          stroke="black"
          strokeOpacity="0.31"
          strokeWidth="4.904"
        />
        <path
          d="M406 309V379C406 387.312 399.73 394 391.938 394H120.063C112.27 394 106 387.312 106 379V309C106 300.688 112.27 294 120.063 294H199.75V299C199.75 318.313 214.457 334 232.563 334H279.438C297.543 334 312.25 318.313 312.25 299V294H391.938C399.73 294 406 300.688 406 309ZM333.344 364C333.344 357.125 328.07 351.5 321.625 351.5C315.18 351.5 309.906 357.125 309.906 364C309.906 370.875 315.18 376.5 321.625 376.5C328.07 376.5 333.344 370.875 333.344 364ZM370.844 364C370.844 357.125 365.57 351.5 359.125 351.5C352.68 351.5 347.406 357.125 347.406 364C347.406 370.875 352.68 376.5 359.125 376.5C365.57 376.5 370.844 370.875 370.844 364Z"
          fill={svgborderColor}
        />
        <path
          d="M231.704 87L278.296 87C286.042 87 292.273 93.2707 292.273 101.065V199.522H343.349C353.716 199.522 358.899 212.122 351.561 219.506L262.979 308.703C258.611 313.099 251.447 313.099 247.079 308.703L158.439 219.506C151.101 212.122 156.284 199.522 166.651 199.522L217.727 199.522L217.727 101.065C217.727 93.2707 223.958 87 231.704 87Z"
          fill={svgborderColor}
        />
      </svg>
    </div>
  );
};
