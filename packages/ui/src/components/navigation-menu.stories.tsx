import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu"

const meta = {
  title: "Components/Navigation Menu",
  component: NavigationMenu,
  tags: ["autodocs"],
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-48 gap-2 p-2">
              <li>
                <NavigationMenuLink className="block rounded-md p-2 hover:bg-muted">
                  Introduction
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink className="block rounded-md p-2 hover:bg-muted">
                  Installation
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
