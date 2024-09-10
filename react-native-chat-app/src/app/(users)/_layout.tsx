import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="user-settings"
        // options={{
        //   headerShown: true,
        //   title: "Chat",
        // }}
      />
    </Stack>
  );
}
