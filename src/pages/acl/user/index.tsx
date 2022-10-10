
import { useEffect } from "react";

export default function User() {
 
  useEffect(() => {
    console.log('user');
    
  }, [])


  return (
    <div>user</div>
  );
}
