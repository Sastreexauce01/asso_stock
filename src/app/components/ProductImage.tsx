import Image from 'next/image'
import React from 'react'

interface ProductImageProps {
    src: string,
    alt: string,
    heightClass?: string,
    widthClass?: string,
}

const ProductImage: React.FC<ProductImageProps> = ({ src, alt, heightClass, widthClass }) => {
    return (
        <div className='avatar '>
            <div className={` mask  mask-squircle ${heightClass} ${widthClass}`}>
                <Image
                    src={src}
                    alt={alt}
                    quality={75}
                    className='object-cover'
                    fill 
                />
            </div>
        </div>
    )
}

export default ProductImage