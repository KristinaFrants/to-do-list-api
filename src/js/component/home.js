import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

export function Home() {
	const [todos, setTodos] = useState([]);

	const [values, setValues] = useState("");
	const api = "https://assets.breatheco.de/apis/fake/todos/user/Kfrants";
	useEffect(() => {
		syncAPI();
	}, []);

	function syncAPI() {
		fetch(api)
			.then(response => {
				if (!response.ok) {
					throw Error(response.text);
				}

				return response.json();
			})
			.then(data => {
				setTodos(data);
			})
			.catch(error => {
				console.error(error);
			});
	}

	const onValueChange = ({ target: { value } }) => {
		setValues(value);
	};

	const Todo = ({ todo, handleCheckboxChange, deleteTodo }) => (
		<li key={todo.id}>
			<input
				type="checkbox"
				checked={todo.done}
				onChange={() => handleCheckboxChange(todo)}
			/>
			<label>{todo.label}</label>
			<button className="delete" onClick={() => deleteTodo(todo.id)}>
				Delete
			</button>
		</li>
	);

	const addTodo = item => {
		console.log("label", item);
		if (item !== "") {
			setTodos([
				...todos,
				{
					label: item,
					done: false,
					id: Date.now() + Math.random()
				}
			]);
			setValues("");
		}
		console.log("Todos", todos);
		fetch(api, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(todos)
		}).then(response => {
			if (!response.ok) {
				throw Error(response.text);
			}

			return response.json();
		});
		// .then(data => {
		// 	// Resync our local component with API data
		// 	syncAPI();
		// })
		// .catch(error => {
		// 	console.error(error);
		// });
	};

	const handleKeyPress = ({ key }) => {
		if (key === "Enter") {
			// addTodo();

			fetch(api, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify([
					...todos,
					{ label: setValues, done: false }
				])
			})
				.then(response => {
					if (!response.ok) {
						throw Error(response.text);
					}

					return response.json();
				})
				.then(data => {
					// Resync our local component with API data
					syncAPI();
				})
				.catch(error => {
					console.error(error);
				});
		}
	};

	const handleCheckboxChange = id => {
		setTodos(
			todos.map(todo => {
				// todo.id === id.id ? !todo.status : console.log(id);
				// return todo;
				if (todo.id === id.id) return { ...todo, status: !todo.status };
				return todo;
			})
		);
	};

	const deleteTodo = bubu => {
		let newTodo = todos.filter((item, index) => index != bubu);
		console.log("delete", newTodo);
		fetch(api, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newTodo)
		})
			.then(response => {
				if (!response.ok) {
					throw Error(response.text);
				}

				return response.json();
			})
			.then(data => {
				// Resync our local component with API data
				syncAPI();
			})
			.catch(error => {
				console.error(error);
			});
		// setTodos(
		// 	todos.filter(
		// 		todo =>
		// 			todo.id != id.id ? (id.done = true) : (id.done = false)
		// 	)
		// );
		// // setTodos(todos.filter(todo => todo.id !== id.id ));
		// console.log(todos);
	};

	return (
		<div className="container">
			<p>
				<label>Add Item</label>
				<input
					id="new-task"
					type="text"
					// value={values}
					name="todoField"
					// onKeyDown={handleKeyPress}
					onChange={e => setValues(e.target.value)}
				/>
				<button onClick={() => addTodo(values)}>Add</button>
			</p>

			<h3>Todo</h3>
			<ul id="incomplete-tasks">
				{todos.filter(todo => !todo.status).map((todo, i) => (
					<Todo
						key={todo.id}
						todo={todo}
						handleCheckboxChange={handleCheckboxChange}
						deleteTodo={() => deleteTodo(i)}
					/>
				))}
			</ul>

			<h3>Completed</h3>
			<ul id="completed-tasks">
				{todos.filter(todo => todo.status).map((todo, index) => (
					<Todo
						key={todo.id}
						todo={todo}
						handleCheckboxChange={handleCheckboxChange}
						deleteTodo={e => deleteTodo(e)}
					/>
				))}
			</ul>
		</div>
	);
}

Home.propTypes = {
	todo: PropTypes.function,
	handleCheckboxChange: PropTypes.function,
	deleteTodo: PropTypes.function
};
