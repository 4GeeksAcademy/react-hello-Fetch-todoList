import React from "react";
import TodoList from "./TodoList";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	return (
		<div className="text-center">
			<h1 className="text-center mt-5"></h1>
			<p>
				<TodoList/>
			</p>
			
		</div>
	);
};

export default Home;
