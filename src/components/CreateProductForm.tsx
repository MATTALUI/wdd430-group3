"use client";

import { BiPlus, BiImageAdd, BiTrash } from "react-icons/bi";
import React, { useState } from "react";
import clsx from "clsx";
import { createProduct } from "@/lib/actions";
import { useSession } from "next-auth/react";
import Axios from "axios";
import Image from "next/image";
import { Category} from "@/types";


export default function ProductForm( { categories }: { categories: Category[] } ) {
  const session = useSession();
  const seller_id = session.data?.user?.id

  const [image, setImage] = useState<string[]>([]);
  const [fileObjects, setFileObjects] = useState<File[]>([]);
  const [selecta, setSelecta] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [names, setNames] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [zodError, setZodError] = useState<{ [key: string]: string[] } | null>(null);

  const addSelecta = () => {

    if(selecta.length > image.length) {
      setError("Finish loading the image before creating a new one.");
      return;
    } else if(selecta.length >= 5) {
      setError("You can only add a maximum of 5 images per product.")
      return;
    } 
    const newSelecta = [ ...selecta, `image${selecta.length + 1}`];
    setSelecta(newSelecta);
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allFiles = e.target.files;
    const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5 Megabytes

    if(allFiles && allFiles.length > 0) {
      const firstFile = allFiles[0];

      // Check if the file size exceeds the limit
      if (firstFile.size > MAX_FILE_SIZE) {
        setError("File size exceeds the limit of 5MB. Please choose a smaller image.");
        e.target.value = ""; // Clear the file input value
        return;
      }

      const firstFileAsUrl  = URL.createObjectURL(firstFile);

      if(names.includes(firstFile.name)) {
        setError("This image has already been loaded.");
        return;
      }

        setImage([ ...image, firstFileAsUrl]);
        setFileObjects([...fileObjects, firstFile]);
        setNames([ ...names, firstFile.name]);
        setError("");
    }
  }

  const deleteImage = (imagePreview: string, selectaItem: string) => {
    const imgIndex = image.indexOf(imagePreview);
    const selectaIndex = selecta.indexOf(selectaItem);

    if(selectaIndex !== -1) {
      const newSelecta = selecta.filter((_, index) => index !== selectaIndex);
      const newImage = image.filter((_, index) => index !== imgIndex);
      const newNames = names.filter((name) => name !== names[imgIndex]);
      const newFileObjects = fileObjects.filter((_, index) => index !== imgIndex);

      setSelecta(newSelecta);
      setImage(newImage);
      setNames(newNames);
      setFileObjects(newFileObjects);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const form = e.currentTarget;
    const formData = new FormData(form);
    const imagesUrls: string[] = [];
  
    // Upload Images to Cloudinary and get image url to store in DB:
    await Promise.all(fileObjects.map(async (file) => {
      formData.append("file", file);
      formData.append("upload_preset", "handcrafted-haven");
      const res = await Axios.post("https://api.cloudinary.com/v1_1/dn72ezrxw/image/upload", formData);
        const imageUrl: string = res.data.secure_url;
        imagesUrls.push(imageUrl);
    }));

    await Promise.all(imagesUrls);

    // Now that all images are uploaded, append URLs to formData
    formData.set("images", JSON.stringify(imagesUrls));
    
    const res = await (createProduct(formData)); // Call the createProduct action
    
    // Update the error state:
    if (typeof res?.message !== "undefined") {
      setError(`${res?.message}`);
    }
    
    // Update the productState based on the response
    if (res?.errors) {
      setZodError(res.errors);
    } else {
      setZodError(null);
    }
  }

  return (
    <div className="w-full max-w-xs">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div>
          <div>
              <input type="hidden" id="seller_id" name="seller_id" value={seller_id}/>
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
                aria-describedby="name-error"
              />
            </div>
            <div className="mb-4" id="name-error" aria-live="polite" aria-atomic="true">
              { zodError?.name &&
                zodError?.name.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
            <div>
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
                aria-describedby="price-error"
              />
            </div>
            <div className="mb-4" id="price-error" aria-live="polite" aria-atomic="true">
              { zodError?.price &&
                zodError?.price.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
                >Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
                id="description"
                name="description"
                aria-describedby="description-error"
              />
            </div>
            <div className="mb-4" id="description-error" aria-live="polite" aria-atomic="true">
              { zodError?.description &&
                zodError?.description.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
            <div>
              <p
                className="block text-gray-700 text-sm font-bold mb-2"
                >Product categories
              </p>
              {
                categories.map((cat, index:number) => (
                  <>
                  <input className="shadow appearance-auto border forced-colors:appearance-auto rounded py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
                    key={index+1}
                    id={cat.name}
                    type="checkbox"
                    name="categories"
                    value={cat.id}
                    aria-describedby="category-error"/>
                  <label key={index}
                    htmlFor={cat.name}><span>&#8202;</span>
                      {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                  </label><br/>
                  </>
                ))
              }
            </div>
            <div className="mb-4" id="categories-error" aria-live="polite" aria-atomic="true">
              { zodError?.categories &&
                zodError?.categories.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
            <div className="mb-4">
              <p
                className="block text-gray-700 text-sm font-bold mb-2"
                >Product Images
              </p>
            </div>
            <div className="mb-2 flex items-center justify-center">
              <div className="w-full">
                <div className="w-full h-52 bg-light flex items-center justify-center relative rounded">
                  
                  <div className="absolute bottom-0 flex items-center justify-center">
                    {
                      image.map((item, index:number) => (
                        <div 
                        key={index} 
                        className={clsx("w-2.5 h-2.5 m-1.5 bg-white rounded-sm cursor-pointer focus:outline-none focus:ring", current===index && "bg-primary")}
                        onClick={() => setCurrent(index)}></div>
                      ))
                    }
                  </div>
                  {
                    image.length < 1 
                    ? null 
                    : <img className="w-11/12 h-11/12 max-w-full max-h-full object-contain" 
                        src={image[current]} 
                        width={250}
                        alt="Product Image" />
                  }
                </div>
                <div className="w-full flex my-2.5 items-center justify-between">
                  <div className="w-11/12 flex items-center justify-start">
                    {
                      selecta.map((item, index:number) => (
                        <div key={index+1} className="w-24 h-24 bg-light-trans mr-2.5 rounded flex items-center justify-center">
                          {
                            index + 1 > image.length
                              ? <>
                                  <input className="hidden"
                                  key={index}
                                  type="file" 
                                  id={`images-${index}`} 
                                  name="images"
                                  style={{display:"none"}} 
                                  onChange={e => onChange(e)}
                                  />
                                  <label htmlFor={`images-${index}`} >
                                    <BiImageAdd className="text-white font-bold size-8 cursor-pointer"/>
                                  </label>
                                </>
                            : <div className="relative max-w-24 max-h-24 overflow-hidden flex justify-center items-center" key={`delete-img-${index}`}> 
                                <p className="absolute top-1 left-1 text-primary rounded bg-white font-bold cursor-pointer" onClick={() => deleteImage(image[index], item)}>
                                  <BiTrash/>
                                </p>
                                <img 
                                  className="object-scale-down rounded" 
                                  key={index}
                                  src={image[index]}
                                  width={96}
                                  alt="Product Image thumbnail" 
                                  onClick={() => setCurrent(index)}/>
                              </div>
                          }
                          
                        </div>
                      ))
                    }
                  </div>
                  <div className="bg-accent rounded focus:outline-none focus:shadow-outline" key="add-image">
                    <button type="button" 
                      className="rounded-md text-white p-2 flex cursor-pointer" 
                      onClick={addSelecta}>
                      <BiPlus className="text-white font-bold"/>
                    </button>
                  </div>
                </div>
                {error && <div style={{ color: "red" }}>{error}</div>}
              </div>
            </div>
        </div>
          <div className="flex items-center justify-center">
            <button type="submit" className={"bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"}>
              Create Product
            </button>
          </div>
      </form>
    </div>
  );
}