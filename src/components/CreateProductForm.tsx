"use client";

import { BiPlus, BiBlock, BiImageAdd } from "react-icons/bi";
import React, { useState } from "react";
import clsx from "clsx";
import { createProduct } from "@/lib/actions";
import { useSession } from "next-auth/react";

export default function ProductForm( {} ) {
  const user = useSession().data?.user;

  const [image, setImage] = useState<string[]>([]);
  // const [fileObjects, setFileObjects] = useState<File[]>([]);
  const [selecta, setSelecta] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [names, setNames] = useState<string[]>([]);
  const [error, setError] = useState("");

  const addSelecta = () => {

    if(selecta.length > image.length) {
      setError("Finish loading the image before creating a new one.");
      return
    } else if(selecta.length >= 5) {
      setError("You can only add a maximum of 5 images per product.")
    } else {
      const newSelecta = [ ...selecta, `image${selecta.length + 1}`];
      setSelecta(newSelecta);
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allFiles = e.target.files;

    if(allFiles && allFiles.length > 0) {
      const firstFile = allFiles[0];
      const firstFileAsUrl  = URL.createObjectURL(firstFile);

      if(names.includes(firstFile.name)) {
        setError("This image has already been loaded.");
        return
      } else {
          setImage([ ...image, firstFileAsUrl]);
          // setFileObjects([...fileObjects, firstFile]);
          setNames([ ...names, firstFile.name]);
          setError("");
      }
    }
  }
  
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  
  //   const form = e.currentTarget;
  //   const formData = new FormData(form);
  
  //   // Append image files to the FormData object
  //   fileObjects.forEach((file) => {
  //     formData.append("images", file);
  //   });
  // };

  const deleteImage = (image1: string, selecta1: string) => {
    const imgIndex = image.indexOf(image1);
    const selectaIndex = selecta.indexOf(selecta1);


    if(selectaIndex !== -1) {
      const newSelecta = selecta.filter((_, index) => index !== selectaIndex);
      const newImage = image.filter((_, index) => index !== imgIndex);
      const newNames = names.filter((name) => name !== names[imgIndex]);
      // const newFileObjects = fileObjects.filter((_, index) => index !== imgIndex);

      setSelecta(newSelecta);
      setImage(newImage);
      setNames(newNames);
      // setFileObjects(newFileObjects);
    }
  }

  return (
    <div className="w-full max-w-xs">
      <form action={createProduct}  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div>
        <div className="mb-4">
            <input type="hidden" id="seller_id" name="seller_id" value={user?.id}/>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
              >Product Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
              id="name"
              type="text"
              name="name"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
              >Price
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
              id="price"
              type="text"
              name="price"
              placeholder="$100.0"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
              >Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
              id="description"
              name="description"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              >Product Images
            </label>
          </div>
          <div className="mb-2 flex items-center justify-center">
            <div className="w-full">
              <div className="w-full h-52 bg-light flex items-center justify-center relative rounded">
                
                <div className="absolute bottom-0 flex items-center justify-center">
                  {
                    image.map((item, index:number) => (
                      <div className={clsx("w-2.5 h-2.5 m-1.5 bg-white rounded-sm cursor-pointer focus:outline-none focus:ring", current===index && "bg-primary")}
                      onClick={() => setCurrent(index)}></div>
                    ))
                  }
                </div>
                {
                  image.length < 1 
                  ? null 
                  : <img className="w-11/12 h-11/12 max-w-full max-h-full object-cover" src={image[current]} alt="" />
                }
              </div>
              <div className="w-full flex my-2.5 items-center justify-between">
                <div className="w-11/12 flex items-center justify-start">
                  {
                    selecta.map((item, index:number) => (
                      <div className="w-24 h-24 bg-light-trans mr-2.5 rounded flex items-center justify-center">
                        {
                          index + 1 > image.length
                            ? <div>
                                <input className="hidden"
                                type="file" 
                                id={`images-${index}`} 
                                name="images"
                                style={{display:"none"}} 
                                onChange={e => onChange(e)}
                                />
                                <label htmlFor={`images-${index}`} >
                                  <BiImageAdd className="text-white font-bold size-8 cursor-pointer"/>
                                </label>
                              </div>
                          : <div> 
                              <label onClick={() => deleteImage(image[index], item)}>
                                <BiBlock className="text-primary font-bold cursor-pointer"/>
                              </label>
                              <img 
                                className="max-w-full max-h-full object-cover" 
                                src={image[index]} 
                                alt="" 
                                onClick={() => setCurrent(index)}/>
                            </div>
                        }
                        
                      </div>
                    ))
                  }
                </div>
                <div className="bg-accent rounded focus:outline-none focus:shadow-outline ">
                  <button type="button" className="py-2 px-4 flex outline-2 items-center justify-between cursor-pointer" onClick={addSelecta}>
                    <BiPlus className="text-white font-bold"/>
                  </button>
                </div>
              </div>
              {error && <div style={{ color: "red" }}>{error}</div>}
            </div>
          </div>
        </div>
          <div className="flex items-center justify-between">
            <button type="submit" className={"bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"}>
              Create Product
            </button>
          </div>
      </form>
    </div>
  );
}