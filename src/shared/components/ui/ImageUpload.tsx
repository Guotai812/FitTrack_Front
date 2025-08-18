// ImageUpload.tsx
import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";

type ImageUploadProps = {
  image?: string; // Optional initial image URL
  id: string;
  onInput: (
    id: string,
    file: string | number | File | null,
    isValid: boolean
  ) => void;
  center?: boolean;
  errorText?: string;
  maxMB?: number; // default 5MB
  accept?: string; // default "image/png,image/jpeg"
  squareSizePx?: number; // preview box size, default 200
};

export default function ImageUpload({
  id,
  onInput,
  center = false,
  errorText,
  maxMB = 5,
  accept = "image/png,image/jpeg",
  squareSizePx = 200,
  image = "",
}: ImageUploadProps) {
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>(image || "");
  const [isValid, setIsValid] = useState<boolean>(true);

  const filePickerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(image || "");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const pickedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pickedFile = event.target.files?.[0] ?? null;

    let valid = false;
    if (pickedFile) {
      const isImage = /^image\/(png|jpe?g)$/i.test(pickedFile.type);
      const underLimit = pickedFile.size <= maxMB * 1024 * 1024;
      valid = isImage && underLimit;

      if (valid) {
        setFile(pickedFile);
        setIsValid(true);
      } else {
        setFile(undefined);
        setIsValid(false);
        event.target.value = ""; // clear input when invalid (optional)
      }
    } else {
      setFile(undefined);
      setIsValid(false);
    }

    onInput(id, pickedFile, valid);
  };

  const pickImageHandler = () => filePickerRef.current?.click();

  return (
    <div className="space-y-2">
      <input
        id={id}
        ref={filePickerRef}
        type="file"
        accept={accept}
        onChange={pickedHandler}
        className="hidden"
      />

      <div
        className={[
          "flex flex-col w-full items-center gap-3",
          center ? "justify-center" : "",
        ].join(" ")}
      >
        {/* Preview box */}
        <div
          className="relative flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 overflow-hidden"
          style={{ width: squareSizePx, height: squareSizePx }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <p className="text-sm text-gray-500">Please pick an image</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-end gap-3">
          <Button type="button" kind="confirm" onClick={pickImageHandler}>
            PICK
          </Button>
          {file && (
            <button
              type="button"
              onClick={() => {
                setFile(undefined);
                setIsValid(image ? true : false);
                setPreviewUrl(image || "");
                if (filePickerRef.current) filePickerRef.current.value = "";
                onInput(id, null, image ? true : false);
              }}
              className="text-xs text-gray-600 hover:text-gray-900 underline self-start"
            >
              Remove
            </button>
          )}
          <p className="text-xs text-gray-500">
            Accepted: {accept.replace(/image\//g, "").replace(/,/g, ", ")} • Max{" "}
            {maxMB}MB
          </p>
        </div>
      </div>

      {!isValid && (
        <p className="text-sm text-red-600">
          {errorText ?? `Please choose a JPG/PNG under ${maxMB}MB.`}
        </p>
      )}
    </div>
  );
}
