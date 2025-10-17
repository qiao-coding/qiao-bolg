import Image from "next/image";
import InfiniteScroll from "./InfiniteScroll";


export function TreeScroll() {
    const items = [
        { key: 'auth', content: <Image src="/about/authjs_img.png" key="auth" alt="auth" width={100} height={100} className="rounded" /> },
        { key: 'redux', content: <Image src="/about/redux_img.png" key="redux" alt="redux" width={100} height={100}  className="rounded"/> },
        { key: 'prisma', content: <Image src="/about/prisma_img.png" key="prisma" alt="prisma" width={100} height={100}/> },
    ];

    return (
        <div style={{ height: '500px', position: 'relative' }}>
            <InfiniteScroll
                items={items}
                isTilted={false}
                tiltDirection='right'
                autoplay={true}
                autoplaySpeed={0.5}
                autoplayDirection="down"
                pauseOnHover={false}
            />
        </div>
    )
    
}