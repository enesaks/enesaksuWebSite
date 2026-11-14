import React, { useEffect, useRef, useState } from 'react';

const HACK_DUMMY_CODE = `
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/fs.h>
#include <asm/uaccess.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Enes Aksu");
MODULE_DESCRIPTION("A simple example Linux module.");

static int __init hello_init(void) {
    printk(KERN_INFO "Hello world 1.\\n");
    // Establishing secure connection to target server...
    // Bypassing firewall policies [OK]
    // Escalating privileges... [ROOT]
    return 0;
}

static void __exit hello_cleanup(void) {
    printk(KERN_INFO "Cleaning up module.\\n");
}

module_init(hello_init);
module_exit(hello_cleanup);

// Dumping system hashes...
// 0x4B1C 0x8F22 0x1A09 0x99BB
// Access Granted.
`.repeat(20);

/** Every key press "types" a few more characters of fake kernel code. */
const HackMode: React.FC<{ onQuit: () => void }> = ({ onQuit }) => {
  const [code, setCode] = useState('');
  const idx = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'q') { onQuit(); return; }
      e.preventDefault();
      const n = Math.floor(Math.random() * 5) + 3;
      const chunk = HACK_DUMMY_CODE.substring(idx.current, idx.current + n);
      idx.current = (idx.current + n) % HACK_DUMMY_CODE.length;
      setCode(prev => (prev + chunk).slice(-6000));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onQuit]);

  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [code]);

  return (
    <div ref={box} className="hack">
      {code}<span className="cursor">{' '}</span>
      <button type="button" className="program-exit" onClick={onQuit}>[ bir şeyler yaz · ESC / Q: çık ]</button>
    </div>
  );
};

export default HackMode;
