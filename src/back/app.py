from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import mysql.connector
import os

app = Flask(__name__)

CORS(app) 

print("Cargando modelos y diccionarios...")
try:
    with open('modelo/diccionarios/N_MUNICIPIO_correspondencia.pkl', 'rb') as f:
        dicc_municipio = pickle.load(f)
    with open('modelo/diccionarios/MAGNITUD_correspondencia.pkl', 'rb') as f:
        dicc_magnitudes = pickle.load(f)
    with open('modelo/diccionarios/TIPO_AREA_correspondencia.pkl', 'rb') as f:
        dicc_area = pickle.load(f)
    with open('modelo/diccionarios/TIPO_ESTACION_correspondencia.pkl', 'rb') as f:
        dicc_estacion = pickle.load(f)
    
    with open('modelo/RandomForestMadrid.pk', 'rb') as f:
        modelo = pickle.load(f)
        
    print("Modelos y diccionarios cargados correctamente.")
except Exception as e:
    print(f"Error crítico cargando archivos pickle: {e}")

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),       
    'password': os.getenv('DB_PASSWORD', ''),  
    'database': os.getenv('DB_NAME', 'test') 
}

def conectar_bbbdd():
    return mysql.connector.connect(**DB_CONFIG)

@app.route('/api/login', methods=['POST'])
def login():
    datos = request.json
    
    id_usuario = datos.get('id_usuario')
    password = datos.get('password')
    
    if not id_usuario or not password:
        return jsonify({"error": "Faltan datos para hacer el login"}), 400

    try:
        conn = conectar_bbbdd()
        cursor = conn.cursor(dictionary=True) 
        
        query = "SELECT * FROM usuarios WHERE id_usuario = %s AND password = %s"
        cursor.execute(query, (id_usuario, password))
        usuario = cursor.fetchone() 
        
        cursor.close()
        conn.close()
        
        if usuario:
            return jsonify({
                "success": True, 
                "mensaje": "Login correcto",
                "empresa": usuario['empresa'] 
            })
        else:
            return jsonify({"success": False, "mensaje": "Credenciales inválidas"}), 401
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/opciones', methods=['GET'])
def obtener_opciones():
    try:
        return jsonify({
            "success": True,
            "municipios": sorted(list(dicc_municipio.keys())),
            "contaminantes": sorted(list(dicc_magnitudes.keys())),
            "areas": sorted(list(dicc_area.keys())),
            "estaciones": sorted(list(dicc_estacion.keys()))
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    datos = request.json
    
    try:
        id_usuario = datos.get('id_usuario')
        municipio = datos.get('municipio')
        contaminante = datos.get('contaminante')
        tipo_area = datos.get('tipo_area')
        tipo_estacion = datos.get('tipo_estacion')
        valor = float(datos.get('valor_contaminante'))
        
        if not id_usuario:
            return jsonify({"success": False, "error": "Falta el ID de usuario"}), 400

        row = [
            valor,
            dicc_municipio[municipio],
            dicc_magnitudes[contaminante],
            dicc_area[tipo_area],
            dicc_estacion[tipo_estacion]
        ]
        
        y_pred = modelo.predict([row])
        pred_value = y_pred[0] 
        
        if pred_value == 0:
            resultado_str = "BAJO"
        elif pred_value == 1:
            resultado_str = "NORMAL"
        else:
            resultado_str = "ALTO"
            
        conn = conectar_bbbdd()
        cursor = conn.cursor(dictionary=True)
        
        query_empresa = "SELECT empresa FROM usuarios WHERE id_usuario = %s"
        cursor.execute(query_empresa, (id_usuario,))
        usuario_db = cursor.fetchone()
        
        if not usuario_db:
            cursor.close()
            conn.close()
            return jsonify({"success": False, "error": "Usuario no encontrado en la base de datos"}), 404
            
        nombre_empresa = usuario_db['empresa'] 
        
        query_insert = """
            INSERT INTO mediciones 
            (empresa, fecha, municipio, contaminante, tipo_area, tipo_estacion, valor_contaminante, resultados)
            VALUES (%s, NOW(), %s, %s, %s, %s, %s, %s)
        """
        valores_insert = (nombre_empresa, municipio, contaminante, tipo_area, tipo_estacion, valor, resultado_str)
        
        cursor.execute(query_insert, valores_insert)
        conn.commit() 
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "success": True,
            "resultado": resultado_str,
            "empresa_registrada": nombre_empresa,
            "mensaje": "Predicción calculada y guardada"
        })

    except KeyError as e:
        return jsonify({"success": False, "error": f"Valor no reconocido por el modelo: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)