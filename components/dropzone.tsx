"use client";

import ReactDropzone from "react-dropzone";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { LuFileSymlink } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import convertFile from "@/utils/convert";
import type { Action } from "@/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import compressFileName from "@/utils/compress-file-name";
import fileToIcon from "@/utils/file-to-icon";
import bytesToSize from "@/utils/bytes-to-size";
import { BiError } from "react-icons/bi";
import { ImSpinner3 } from "react-icons/im";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdClose, MdDone } from "react-icons/md";
import { Button } from "./ui/button";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import loadFfmpeg from "@/utils/load-ffmpeg";
import { HiOutlineDownload } from "react-icons/hi";

const extensions = {
  image: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "ico",
    "tif",
    "tiff",
    "svg",
    "raw",
    "tga",
  ],
  video: [
    "mp4",
    "m4v",
    "mp4v",
    "3gp",
    "3g2",
    "avi",
    "mov",
    "wmv",
    "mkv",
    "flv",
    "ogv",
    "webm",
    "h264",
    "264",
    "hevc",
    "265",
  ],
  audio: ["mp3", "wav", "ogg", "aac", "wma", "flac", "m4a"],
};
export default function Dropzone() {
  const { toast } = useToast();
  const [is_hover, setIsHover] = useState(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [is_ready, setIsReady] = useState<boolean>(false);
  const [is_loaded, setIsLoaded] = useState<boolean>(false);
  const [files, setFiles] = useState<Array<any>>([]);
  const [defaultValues, setDefaultValues] = useState<string>("video");
  const [selcted, setSelected] = useState<string>("...");
  const [is_done, setIsDone] = useState<boolean>(false);
  const [is_converting, setIsConverting] = useState<boolean>(false);
  const ffmpegRef = useRef<any>(null);
  const accepted_files = {
    "image/*": [
      ".jpg, .jpeg, .png, .gif, .bmp, .tiff , .webp , .ico, .raw, .tga",
    ],
    "video/*": [],
    "audio/*": [],
  };
  const reset = () => {
    setIsDone(false);
    setActions([]);
    setFiles([]);
    setIsReady(false);
    setIsConverting(false);
  };

  const download = (action: Action) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = action.url;
    a.download = action.output;

    document.body.appendChild(a);
    a.click();

    // Clean up after download
    URL.revokeObjectURL(action.url);
    document.body.removeChild(a);
  };
  const downloadAll = (): void => {
    for (let action of actions) {
      !action.is_error && download(action);
    }
  };

  const convert = async (): Promise<any> => {
    let tmp_actions = actions.map((elt) => ({
      ...elt,
      is_converting: true,
    }));
    setActions(tmp_actions);
    setIsConverting(true);
    for (let action of tmp_actions) {
      try {
        const { url, output } = await convertFile(ffmpegRef.current, action);
        tmp_actions = tmp_actions.map((elt) =>
            elt === action
                ? {
                  ...elt,
                  is_converted: true,
                  is_converting: false,
                  url,
                  output,
                }
                : elt,
        );
        setActions(tmp_actions);
      } catch (err) {
        tmp_actions = tmp_actions.map((elt) =>
            elt === action
                ? {
                  ...elt,
                  is_converted: false,
                  is_converting: false,
                  is_error: true,
                }
                : elt,
        );
        setActions(tmp_actions);
      }
    }
    setIsDone(true);
    setIsConverting(false);
  };

  const handleUpload = (data: Array<any>): void => {
    handleExitHover();
    setFiles(data);
    const tmp: Action[] = [];
    data.forEach((file: any) => {
      // const formData = new FormData();
      tmp.push({
        file_name: file.name,
        file_size: file.size,
        from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
        to: undefined,
        file_type: file.type,
        file,
        is_converted: false,
        is_converting: false,
        is_error: false,
      });
    });
    setActions(tmp);
    setIsLoaded(true);
  };
  const updateAction = (file_name: String, to: string) => {
    setActions(
        actions.map((action): Action => {
          if (action.file_name === file_name) {
            console.log("FOUND");
            return {
              ...action,
              to,
            };
          }

          return action;
        }),
    );
  };
  function handleHover() {
    setIsHover(true);
  }

  function handleExitHover() {
    setIsHover(false);
  }

  // const checkIsReady = (): void => {
  //   let tmp_is_ready = true;
  //   actions.forEach((action: Action) => {
  //     if (action.to === null || action.to === undefined) {
  //       tmp_is_ready = false;
  //     }
  //   });
  //   setIsReady(tmp_is_ready);
  // };
  const checkIsReady = (): void => {
    let tmp_is_ready = true;
    actions.forEach((action: Action) => {
      if (!action.to) tmp_is_ready = false;
    });
    setIsReady(tmp_is_ready);
  };

  const deleteAction = (action: Action): void => {
    console.log(action);
    setActions(actions.filter((elt) => elt !== action));
    setFiles(files.filter((elt) => elt.name !== action.file_name));
  };

  // const deleteAction = (action: Action): void => {
  //   setActions(actions.filter((elt) => elt.file_name !== action.file_name));
  //   setFiles(files.filter((elt) => elt.name !== action.file_name));
  // };

  useEffect(() => {
    if (!actions.length) {
      setIsDone(false);
      setFiles([]);
      setIsReady(false);
      setIsConverting(false);
    } else checkIsReady();
  }, [actions]);
  useEffect(() => {
    load();
  }, []);
  const load = async () => {
    const ffmpeg_response: FFmpeg = await loadFfmpeg();
    ffmpegRef.current = ffmpeg_response;
    setIsLoaded(true);
  };


  if (actions.length) {
    return (
        <Table className="mt-10">
          <TableCaption>
            Select the format you want and click on the convert button
          </TableCaption>

          <TableBody>
            {actions.map((action: Action, i: any) => (
                <TableRow
                    key={i}
                    className="w-full py-2 mb-1.5 space-y-2 lg:py-0 relative cursor-pointer rounded-xl border h-fit lg:h-20 px-4 lg:px-10 flex flex-wrap lg:flex-nowrap items-center justify-between"
                >
                  {!is_loaded && (
                      <Skeleton className="h-full w-full -ml-10 cursor-progress absolute rounded-xl" />
                  )}

                  <TableCell className="font-medium">
                    <div
                        className=" flex items-center gap-3
                "
                    >
                      {fileToIcon(action.file_type)}
                      {compressFileName(action.file_name)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {bytesToSize(action.file_size)}
                  </TableCell>
                  <TableCell>
                    {action.is_error ? (
                        <Badge variant="destructive">
                          Error converting file
                          <BiError />
                        </Badge>
                    ) : action.is_converted ? (
                        <Badge variant="default" className={"bg-green-500"}>
                          Done
                        </Badge>
                    ) : action.is_converting ? (
                        <Badge variant="secondary">
                          Converting
                          <span className={"animate-spin"}>
                      <ImSpinner3 />
                    </span>
                        </Badge>
                    ) : (
                        <div className="text-gray-400 text-md flex items-center gap-4">
                          <span>Convert to</span>
                          <Select
                              onValueChange={(value) => {
                                if (extensions.audio.includes(value)) {
                                  setDefaultValues("audio");
                                } else if (extensions.video.includes(value)) {
                                  setDefaultValues("video");
                                }
                                setSelected(value);
                                updateAction(action.file_name, value);
                              }}
                              value={action.to}
                          >
                            <SelectTrigger className="w-32 outline-none focus:outline-none focus:ring-0 text-center text-gray-600 bg-gray-50 text-md font-medium">
                              <SelectValue placeholder="..." />
                            </SelectTrigger>
                            <SelectContent className="h-fit">
                              {action.file_type.includes("image") && (
                                  <div className="grid grid-cols-2 gap-2 w-fit">
                                    {extensions.image.map((elt, i) => (
                                        <div key={i} className="col-span-1 text-center">
                                          <SelectItem value={elt} className="mx-auto">
                                            {elt}
                                          </SelectItem>
                                        </div>
                                    ))}
                                  </div>
                              )}
                              {action.file_type.includes("video") && (
                                  <Tabs defaultValue={defaultValues} className="w-full">
                                    <TabsList className="w-full">
                                      <TabsTrigger value="video" className="w-full">
                                        Video
                                      </TabsTrigger>
                                      <TabsTrigger value="audio" className="w-full">
                                        Audio
                                      </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="video">
                                      <div className="grid grid-cols-3 gap-2 w-fit">
                                        {extensions.video.map((elt, i) => (
                                            <div
                                                key={i}
                                                className="col-span-1 text-center"
                                            >
                                              <SelectItem value={elt} className="mx-auto">
                                                {elt}
                                              </SelectItem>
                                            </div>
                                        ))}
                                      </div>
                                    </TabsContent>
                                    <TabsContent value="audio">
                                      <div className="grid grid-cols-3 gap-2 w-fit">
                                        {extensions.audio.map((elt, i) => (
                                            <div
                                                key={i}
                                                className="col-span-1 text-center"
                                            >
                                              <SelectItem value={elt} className="mx-auto">
                                                {elt}
                                              </SelectItem>
                                            </div>
                                        ))}
                                      </div>
                                    </TabsContent>
                                  </Tabs>
                              )}
                              {action.file_type.includes("audio") && (
                                  <div className="grid grid-cols-2 gap-2 w-fit">
                                    {extensions.audio.map((elt, i) => (
                                        <div key={i} className="col-span-1 text-center">
                                          <SelectItem value={elt} className="mx-auto">
                                            {elt}
                                          </SelectItem>
                                        </div>
                                    ))}
                                  </div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {action.is_converted ? (
                        <Button variant="outline" onClick={() => download(action)}>
                          Download
                        </Button>
                    ) : (
                        <span
                            onClick={() => deleteAction(action)}
                            className="cursor-pointer hover:bg-gray-50 rounded-full h-10 w-10 flex items-center justify-center text-2xl text-gray-400"
                        >
                    <MdClose />
                  </span>
                    )}
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
          <div className="flex w-full justify-end py-2">
            {is_done ? (
                <div className="space-y-4 w-fit">
                  <Button
                      size="lg"
                      className="rounded-xl bg-blue-600 hover:animate-pulse font-semibold hover:bg-blue-500 relative py-4 text-md flex gap-2 items-center w-full"
                      onClick={downloadAll}
                  >
                    {actions.length > 1 ? "Download All" : "Download"}
                    <HiOutlineDownload />
                  </Button>
                  <Button
                      size="lg"
                      onClick={reset}
                      variant="outline"
                      className="rounded-xl hover:border-blue-600 hover:animate-pulse border-2 bg-transparent hover:bg-transparent"
                  >
                    Convert Another File(s)
                  </Button>
                </div>
            ) : (
                <Button
                    size="lg"
                    disabled={!is_ready || is_converting}
                    className="rounded-xl bg-blue-600 hover:animate-pulse font-semibold hover:bg-blue-500 relative py-4 text-md flex gap-2 items-center w-44"

                    onClick={convert}
                >
                  {is_converting ? (
                      <span className="animate-spin text-lg">
                  <ImSpinner3 />
                </span>
                  ) : (
                      <span>Convert Now</span>
                  )}
                </Button>
            )}
          </div>
        </Table>
    );
  }
  return (
      <ReactDropzone
          onDrop={handleUpload}
          onDragEnter={handleHover}
          onDragLeave={handleExitHover}
          accept={accepted_files}
          onDropRejected={() => {
            handleExitHover();
            toast({
              variant: "destructive",
              title: "Error uploading your file(s)",
              description: "Allowed Files: Audio, Video and Images.",
              duration: 5000,
            });
          }}
          onError={() => {
            handleExitHover();
            toast({
              variant: "destructive",
              title: "Error uploading your file(s)",
              description: "Allowed Files: Audio, Video and Images.",
              duration: 5000,
            });
          }}
      >
        {({ getRootProps, getInputProps }) => (
            <div
                {...getRootProps()}
                className="
                bg-gray-900 backdrop-blur-lg bg-opacity-20
                flex flex-col items-center justify-center w-full
                h-72
                flex-1 lg:px-24 lg:py-12 md:px-12 md:py-4 2xl:px-48 2xl:py-8
                xs:px-1 xs:py-2 sm:px-2 sm:py-4
                text-center border-2 border-gray-300  rounded-lg"
            >
              <input {...getInputProps()} />
              <div className="space-y-4 text-gray-500 p-2">
                {is_hover ? (
                    <>
                      <div className="justify-center flex text-6xl">
                        <LuFileSymlink />
                      </div>
                      <h3 className="text-center font-medium text-2xl lg:text-3xl">
                        Yes, right there
                      </h3>
                    </>
                ) : (
                    <>
                      <div
                          className="justify-center flex text-3xl lg:text-6xl
                    "
                      >
                        <FiUploadCloud />
                      </div>
                      <h3
                          className="text-center font-medium text-2xl lg:text-3xl

                    "
                      >
                        Click, or drop your files here
                      </h3>
                    </>
                )}
              </div>
            </div>
        )}
      </ReactDropzone>
  );
}
