import { Button } from "@/components/ui/button"
import { createRandomAccount, createAsset } from "@/utils/methods"

export const HomePage = () => {
  return <div><Button onClick={() => createAsset()}>Click Me</Button></div>
}
