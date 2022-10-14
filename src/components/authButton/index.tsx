
import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/pages/login/slice"

const AuthButton = (props: { authKey: any; children: any; }) => {
  const { authKey, children } = props;
  const {buttons} = useAppSelector(selectUser);
  const authorized = buttons?.includes(authKey);

  return (
    authorized ? children : null 
  )
}

export default AuthButton
