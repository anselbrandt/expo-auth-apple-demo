// use jwt as email capture fallback
// import jwt from "jwt-decode";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface IdentityToken {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  c_hash: string;
  email: string;
  email_verified: string;
  auth_time: number;
  nonce_supported: boolean;
}

export default function App() {
  const [userData, setUserData] = useState<any>();

  const handleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.email) {
        await SecureStore.setItemAsync(
          credential.user,
          JSON.stringify(credential)
        );
        setUserData(credential);
      } else {
        const saved = await SecureStore.getItemAsync(credential.user);
        const data = JSON.parse(saved as string);
        setUserData(data);
      }
      // fallback if initial signin interupted and profile not stored
      // const token: IdentityToken = jwt(credential.identityToken as string);
      // setEmail(token.email);
    } catch (e: any) {
      if (e.code === "ERR_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.div}>
        {!userData && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={5}
            style={{ width: 200, height: 44 }}
            onPress={handleLogin}
          />
        )}
      </View>
      {userData && (
        <>
          <View style={styles.div}>
            <Text>{`${userData.fullName.givenName} ${userData.fullName.familyName}`}</Text>
          </View>
          <View style={styles.div}>
            <Text>{`${userData.email}`}</Text>
          </View>
          <View style={styles.div}>
            <Text>{`${userData.user}`}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  div: {
    backgroundColor: "#fff",
  },
});
