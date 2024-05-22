"use client";

import { BiPlus } from "react-icons/bi";
import React, { useState } from "react";
import cx from "classnames";

export default function ProductForm() {
  const [image, setImage] = useState<any>([]);
  const [selecta, setSelecta] = useState<any>([]);
  const [current, setCurrent] = useState(0);
  const [names, setNames] = useState<any>([]);

  const addSelecta = () => {
    let image1 = selecta.length;
    if(selecta.length > image.length) {
      alert("Finish loading the image before creating a new one.");
      return
    } else if(selecta.length >= 5) {
      alert("You can only add a maximum of 5 images per product.")
    } else {
      selecta.push(`image${image1 + 1}`);
      setSelecta(selecta.map((item:any) => item));
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const one:any = e.target.files;
    const two = URL.createObjectURL(one[0]);
    if(names.includes(one[0].name)) {
      alert("Asset Available")
      return
    } else {
      image.push(two);
      names.push(one[0].name);
      setImage(image.map((item:any) => item));
      setNames(names.map((item:any) => item));
    }
  }

  const deleteImage = (image1:any, selecta1:any) => {
    const imgIndex = image.indexOf(image1);
    const selectaIndex = selecta.indexOf(selecta1);

    if(selecta.includes(selecta1)) {
      selecta.splice(selectaIndex, 1);
      image.splice(imgIndex, 1);
      names.splice(image1.name, 1);
      setSelecta(selecta.map((item:any) => item));
      setImage(image.map((item:any) => item));
      setNames(names.map((item:any) => item));
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
            <div className="item w-full">
              <div className="hero w-full h-52 bg-light flex items-center justify-center relative rounded">
                
                <div className="thumbs absolute bottom-0 flex items-center justify-center">
                  {
                    image.map((item:any, index:number) => (
                      <div className={cx("dot w-2.5 h-2.5 m-1.5 bg-white active:bg-primary cursor-pointer focus:outline-none focus:ring", current===index && "bg-primary")}
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
              <div className="action w-full flex my-2.5 items-center justify-between">
                <div className="left w-11/12 flex items-center justify-start">
                  {
                    selecta.map((item:any, index:number) => (
                      <div className="item w-24 h-24 bg-light-trans mr-2.5 rounded flex items-center justify-center">
                        {
                          index + 1 > image.length
                            ? <div>
                                <input className="hidden" type="file" 
                                id="file" 
                                style={{display:"none"}} 
                                onChange={e => onChange(e)}
                                />
                                <label htmlFor="file">
                                  <BiPlus className="text-white font-bold size-8 cursor-pointer"/>
                                </label>
                            </div>
                          : <img className="max-w-full max-h-full object-cover" src={image[index]} alt="" 
                            onClick={() => setCurrent(index)}/>
                        }
                      </div>
                    ))
                  }
                </div>
                <div className="right bg-accent rounded focus:outline-none focus:shadow-outline ">
                  <div className="add py-2 px-4 flex items-center justify-between cursor-pointer" onClick={() => addSelecta()}>
                    <BiPlus className="text-white font-bold"/>
                  </div>
                </div>
              </div>
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