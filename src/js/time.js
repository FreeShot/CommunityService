setup.time = {
	getHour: () => `${("00" + Math.floor(State.variables.time.minute / 60)).slice(-2)}:${("00" + State.variables.time.minute % 60).slice(-2)}`,
}