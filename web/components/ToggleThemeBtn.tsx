import { Tooltip, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSunHigh, IconMoonFilled } from '@tabler/icons-react';

function ToggleThemeBtn() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <Tooltip label={"Toggle color scheme"}>
        <ActionIcon
            variant="light"
            color={dark ? 'yellow' : 'blue'}
            onClick={() => toggleColorScheme()}
            // title="Toggle color scheme"
        >
            {dark ? <IconSunHigh size={16} /> : <IconMoonFilled size={16} />}
        </ActionIcon>
        </Tooltip>
    );
}

export default ToggleThemeBtn