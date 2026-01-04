

 function throttle<T>(fn: (this:T, ...args:T[]) => void, delay: number) {

    let lastTime=0

    return function<This>(this: This, ...args:T[]) {
        const conthis = this as  unknown as T;
        const now = Date.now()
        if (now - lastTime > delay) {
            lastTime = now
            fn.apply(conthis, args)
            return true
        }
        return false
    }
    
}

export  { throttle }