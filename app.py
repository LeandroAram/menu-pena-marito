from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def inicio():
    return render_template('index.html')

@app.route('/menu_es')
def menu_es():
    return render_template('menu_es.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)