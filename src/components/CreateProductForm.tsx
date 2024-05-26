"use client";

import { BiPlus, BiBlock } from "react-icons/bi";
import React, { useState } from "react";
import clsx from "clsx";

export default function ProductForm() {
  const [image, setImage] = useState<string[]>([]);
  const [selecta, setSelecta] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [names, setNames] = useState<string[]>([]);
  const [error, setError] = useState("");

  const addSelecta = () => {
    let image1 = selecta.length;

    if(selecta.length > image.length) {
      setError("Finish loading the image before creating a new one.");
      return
    } else if(selecta.length >= 5) {
      setError("You can only add a maximum of 5 images per product.")
    } else {
      const newSelecta = [ ...selecta, `image${image1 + 1}`];
      setSelecta(newSelecta);
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allFiles: FileList | null = e.target.files;

    if(allFiles != null && allFiles.length > 0) {
      const firstFile = allFiles[0];
      const firstFileAsUrl  = URL.createObjectURL(firstFile);
    if(names.includes(firstFile.name)) {
      setError("This image has already been loaded.");
      return
    } else {
      console.log(firstFile.name)
        const newImage = [ ...image, firstFileAsUrl];
        const newNames = [ ...names, firstFile.name]

        setImage(newImage);
        setNames(newNames);
        setError("");
    }
    }
  }

  const deleteImage = (image1:any, selecta1:any) => {
    const imgIndex = image.indexOf(image1);
    const selectaIndex = selecta.indexOf(selecta1);

    if(selectaIndex !== -1) {
      const newSelecta = selecta.filter((_, index) => index !== selectaIndex);
      const newImage = image.filter((_, index) => index !== imgIndex);
      const newNames = names.filter((name) => name !== names[imgIndex]);

      setSelecta(newSelecta);
      setImage(newImage);
      setNames(newNames);
    }
  }

  return (
    <div className="w-full max-w-xs">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div>
        
        <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="prodName"
              >Product Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
              id="prodName"
              type="text"
              name="prodName"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="prodPrice"
              >Price
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
              id="prodPrice"
              type="text"
              name="prodPrice"
              placeholder="$100.0"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="prodDescription"
              >Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
              id="prodDescription"
              name="prodDescription"
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
                      <div className={clsx("w-2.5 h-2.5 m-1.5 bg-white rounded-sm active:bg-primary cursor-pointer focus:outline-none focus:ring", current===index && "bg-primary")}
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
                                id="file" 
                                style={{display:"none"}} 
                                onChange={e => onChange(e)}/>
                                
                                <label htmlFor="file">
                                  <BiPlus className="text-white font-bold size-8 cursor-pointer"/>
                                </label>
                            </div>
                            
                          : <div> 
                              <label onClick={() => deleteImage(image[index], item)}>
                                <BiBlock className="text-primary font-bold cursor-pointer"/>
                              </label>
                              <img className="max-w-full max-h-full object-cover" src={image[index]} alt="" 
                                onClick={() => setCurrent(index)}/>
                            </div>
                        }
                        
                      </div>
                    ))
                  }
                </div>
                <div className="bg-accent rounded focus:outline-none focus:shadow-outline ">
                  <div className="py-2 px-4 flex items-center justify-between cursor-pointer" 
                    onClick={() => addSelecta()}>
                    <BiPlus className="text-white font-bold"/>
                  </div>
                </div>
              </div>
              {error && <div style={{ color: "red" }}>{error}</div>}
            </div>
          </div>
        </div>
          <div className="flex items-center justify-between">
            <button className={"bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"}>
              Create Product
            </button>
          </div>
      </form>
    </div>
  );
}