import { Dialog, Transition } from "@headlessui/react";
import { CldUploadButton } from "next-cloudinary";
import React, { Fragment } from "react";
import Image from "next/image";
import {
  FieldValues,
  SubmitHandler,
  UseFormHandleSubmit,
} from "react-hook-form";
import { LoadingButton } from "../LoadingButton";

interface UploadModelProps {
  isOpen: boolean;
  onUpload: any;
  image: string | null | undefined;
  isLoading: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: UseFormHandleSubmit<
    {
      name: string | null | undefined;
      image: string | null | undefined;
    },
    undefined
  >;
  onSubmit: SubmitHandler<FieldValues>;
}

export const UploadModel: React.FC<UploadModelProps> = ({
  isOpen,
  onUpload,
  image,
  isLoading,
  setIsOpen,
  handleSubmit,
  onSubmit,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        open={isOpen}
        onClose={() => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-sm bg-white text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 text-white font-nunito font-medium bg-pink-500 py-2 px-6 rounded-bl-2xl rounded-br-2xl"
                >
                  Upload Picture
                </Dialog.Title>

                <div className="p-6">
                  <div className="mt-6 w-full flex flex-col gap-4 items-center">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden">
                      {image && (
                        <Image
                          src={image}
                          alt={"Avatar"}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <CldUploadButton
                      options={{ maxFiles: 1 }}
                      onUpload={(result: any) => onUpload(result)}
                      uploadPreset="vmnlloyx"
                    >
                      <LoadingButton disabled={isLoading}>Upload</LoadingButton>
                    </CldUploadButton>
                  </div>

                  <div className="mt-12 w-full flex justify-end gap-4">
                    {image && (
                      <>
                        <LoadingButton
                          disabled={isLoading}
                          variant={"outline"}
                          onClick={() => setIsOpen(false)}
                        >
                          Cancel
                        </LoadingButton>

                        <LoadingButton
                          isLoading={isLoading}
                          disabled={isLoading}
                          loaderColor="text-pink-600"
                          onClick={handleSubmit(onSubmit)}
                          className="inline-flex justify-center rounded-md border border-transparent bg-pink-100 px-4 py-2 text-sm font-medium text-pink-600 hover:bg-pink-200"
                        >
                          Confirm
                        </LoadingButton>
                      </>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
