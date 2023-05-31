import { Group } from "@mantine/core"
import ToggleThemeBtn from "./ToggleThemeBtn"
import { IconBrandGithubFilled, IconBrandNpm } from '@tabler/icons-react';
import GoUrlBtn from "./GoUrlBtn";
import ExplainsModal from "./ExplainsModal";

function Layout({ children }: any) {

    return (
        <>
            <Group position="right" mt={16} mr={16}>
                <ExplainsModal/>
                <GoUrlBtn title="Github" url={"https://github.com/r48n34/zip-data-in-png"} icon={<IconBrandGithubFilled size={16}/>}/>
                <GoUrlBtn title="npm" url={"https://www.npmjs.com/package/zip-data-in-png"} icon={<IconBrandNpm size={16}/>}/>
                <ToggleThemeBtn/>
            </Group>

            <div>
                {children}
            </div>
        </>
    )
}

export default Layout